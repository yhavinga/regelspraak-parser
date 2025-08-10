import { 
  createConnection, 
  TextDocuments, 
  DiagnosticSeverity, 
  DocumentSymbol, 
  SymbolKind, 
  Range, 
  MessageType,
  CodeAction,
  CodeActionKind,
  TextEdit,
  WorkspaceEdit,
  InsertTextFormat,
  CompletionItem,
  CompletionItemKind,
  SemanticTokens,
  SemanticTokensParams,
  SemanticTokensBuilder,
  SemanticTokenTypes,
  SemanticTokenModifiers
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

// Import the parser directly from dist files
import { AntlrParser } from '@regelspraak/parser/parser';
import { SemanticAnalyzer } from '@regelspraak/parser/analyzer';
import { improveErrorMessage } from './src/error-improver';

const connection = createConnection();
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// Define semantic token types and modifiers
const tokenTypes = [
  SemanticTokenTypes.keyword,      // 0: Keywords (Parameter, Regel, Objecttype, etc.)
  SemanticTokenTypes.variable,     // 1: Parameter references
  SemanticTokenTypes.type,         // 2: Type names (Bedrag, Numeriek, etc.)
  SemanticTokenTypes.class,        // 3: Object types
  SemanticTokenTypes.property,     // 4: Attributes/Kenmerken
  SemanticTokenTypes.function,     // 5: Function calls
  SemanticTokenTypes.number,       // 6: Number literals
  SemanticTokenTypes.string,       // 7: String literals
  SemanticTokenTypes.operator,     // 8: Operators
  SemanticTokenTypes.comment,      // 9: Comments
  SemanticTokenTypes.namespace,    // 10: Domains
  SemanticTokenTypes.enum,         // 11: Domain values
  SemanticTokenTypes.struct        // 12: Dimensies
];

const tokenModifiers = [
  SemanticTokenModifiers.declaration,  // 0: Declarations
  SemanticTokenModifiers.definition,   // 1: Definitions
  SemanticTokenModifiers.readonly,     // 2: Constants
  SemanticTokenModifiers.defaultLibrary // 3: Built-in functions
];

// Create token type/modifier maps for faster lookup
const tokenTypeMap = new Map(tokenTypes.map((type, index) => [type, index]));
const tokenModifierMap = new Map(tokenModifiers.map((mod, index) => [mod, 1 << index]));

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: 1,
    diagnosticProvider: { interFileDependencies: false },
    documentSymbolProvider: true,
    hoverProvider: true,
    completionProvider: {
      resolveProvider: false,
      triggerCharacters: [' ', ':', '.', ',', '(', '<', '>', '=', '+', '-', '*', '/']
    },
    definitionProvider: true,
    referencesProvider: true,
    codeActionProvider: true,
    semanticTokensProvider: {
      legend: {
        tokenTypes: tokenTypes,
        tokenModifiers: tokenModifiers
      },
      full: true
    },
    documentFormattingProvider: true
  }
}));

// Error message improvement moved to src/error-improver.ts
// This comment documents where the function was moved for maintainability

// The onDidChangeContent event also fires when a document is first opened,
// so we don't need a separate onDidOpen handler

// Handle document changes AND initial open
documents.onDidChangeContent(async (change) => {
  await validateDocument(change.document);
});

// Shared validation logic
async function validateDocument(document: any) {
  const parser = new AntlrParser();
  const analyzer = new SemanticAnalyzer();
  
  try {
    const { model } = parser.parseWithLocations(document.getText());
    analyzer.analyze(model);
    
    // No errors - send empty diagnostics
    connection.sendDiagnostics({ 
      uri: document.uri, 
      diagnostics: [] 
    });
  } catch (e: any) {
    // Extract line:column from error message
    const match = e.message?.match(/line (\d+):(\d+)/);
    
    if (match) {
      const line = parseInt(match[1]) - 1;  // Convert to 0-based
      const character = parseInt(match[2]);
      
      // Improve the error message with helpful hints
      const improvedMessage = improveErrorMessage(
        e.message, 
        document.getText(),
        line
      );
      
      connection.sendDiagnostics({
        uri: document.uri,
        diagnostics: [{
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line, character },
            end: { line, character: character + 10 }
          },
          message: improvedMessage,
          source: 'regelspraak'
        }]
      });
    } else {
      // Fallback for errors without line:column
      const improvedMessage = improveErrorMessage(
        e.message || 'Unknown error',
        document.getText(),
        0
      );
      
      connection.sendDiagnostics({
        uri: document.uri,
        diagnostics: [{
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 10 }
          },
          message: improvedMessage,
          source: 'regelspraak'
        }]
      });
    }
  }
}

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
    connection.console.error('Document symbols error: ' + (e.message || e));
    // Return empty array if parsing fails
    return [];
  }
});

// Helper to find node at a given position
function findNodeAtPosition(node: any, position: { line: number; character: number }, depth: number = 0): any {
  // Use location property directly from node
  const location = node?.location;
  if (!location) {
    // If no location for this node, try its children
    for (const key of Object.keys(node || {})) {
      const value = node[key];
      if (value && typeof value === 'object') {
        if (Array.isArray(value)) {
          for (const item of value) {
            const result = findNodeAtPosition(item, position, depth + 1);
            if (result) return result;
          }
        } else {
          const result = findNodeAtPosition(value, position, depth + 1);
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
  
  // Debug deep traversal (disabled)
  // if (depth === 0) {
  //   console.error(`Starting traversal at node type: ${node.type || 'unknown'}`);
  // }
  
  // Traverse all properties looking for child nodes
  for (const key of Object.keys(node)) {
    const value = node[key];
    
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        // Check each item in array
        for (const item of value) {
          if (item && typeof item === 'object') {
            const childMatch = findNodeAtPosition(item, position, depth + 1);
            if (childMatch) {
              bestMatch = childMatch;
            }
          }
        }
      } else {
        // Always check the object, regardless of whether it has location
        const childMatch = findNodeAtPosition(value, position, depth + 1);
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
    const { model } = parser.parseWithLocations(document.getText());
    
    // Find node at position
    const node = findNodeAtPosition(model, params.position);
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

// Define snippets for common RegelSpraak patterns
const snippets: Map<string, CompletionItem> = new Map([
  ['param', {
    label: 'Parameter',
    kind: CompletionItemKind.Snippet,
    insertText: 'Parameter ${1:de|het} ${2:naam}: ${3|Bedrag,Numeriek,Tekst,Datum,Boolean,Percentage|}${4: met eenheid ${5:eenheid}};',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Insert a parameter declaration',
    detail: 'Parameter snippet'
  }],
  ['regel', {
    label: 'Regel',
    kind: CompletionItemKind.Snippet,
    insertText: 'Regel ${1:naam}\n  geldig ${2|altijd,vanaf ${3:datum},indien ${3:conditie}|}\n    ${4:Het|De} ${5:attribuut} ${6|wordt,moet berekend worden als,moet gesteld worden op|} ${7:expressie};',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Insert a rule declaration',
    detail: 'Rule snippet'
  }],
  ['object', {
    label: 'Objecttype',
    kind: CompletionItemKind.Snippet,
    insertText: 'Objecttype ${1:de|het} ${2:naam}${3: (mv: ${4:meervoud})}\n  ${5:attribuut} ${6|Bedrag,Numeriek,Tekst,Datum,Boolean|};',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Insert an object type declaration',
    detail: 'Object type snippet'
  }],
  ['domein', {
    label: 'Domein',
    kind: CompletionItemKind.Snippet,
    insertText: 'Domein ${1:naam}: ${2:\'waarde1\'}, ${3:\'waarde2\'}, ${4:\'waarde3\'};',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Insert a domain declaration',
    detail: 'Domain snippet'
  }],
  ['beslis', {
    label: 'Beslistabel',
    kind: CompletionItemKind.Snippet,
    insertText: 'Beslistabel ${1:naam}\n  ${2:conditie1} | ${3:conditie2} | ${4:resultaat}\n  ${5:ja}       | ${6:nee}      | ${7:waarde1}\n  ${8:nee}      | ${9:ja}       | ${10:waarde2};',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Insert a decision table',
    detail: 'Decision table snippet'
  }],
  ['indien', {
    label: 'indien',
    kind: CompletionItemKind.Snippet,
    insertText: 'indien ${1:conditie}',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Insert an if condition',
    detail: 'Condition snippet'
  }],
  ['geldig', {
    label: 'geldig',
    kind: CompletionItemKind.Snippet,
    insertText: 'geldig ${1|altijd,vanaf ${2:datum},tot ${2:datum},indien ${2:conditie}|}',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Insert a validity clause',
    detail: 'Validity snippet'
  }],
  
  // Complex structure snippets
  ['regelcond', {
    label: 'Regel met conditie',
    kind: CompletionItemKind.Snippet,
    insertText: 'Regel ${1:BerekenKorting}\n  geldig indien ${2:klant.leeftijd} >= ${3:65}\n    ${4:De} ${5:korting} wordt ${6:10} %;\n    ${7:Het} ${8:totaal} wordt ${9:prijs} min ${10:korting};',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Rule with conditional validity and multiple assignments',
    detail: 'Complex rule snippet'
  }],
  
  ['beslistabel2', {
    label: 'Beslistabel complex',
    kind: CompletionItemKind.Snippet,
    insertText: 'Beslistabel ${1:BepaalTarief}\n  ${2:leeftijd < 18} | ${3:student} | ${4:inkomen < 1000} | ${5:tarief}\n  ja               | -          | -                | ${6:5}\n  nee              | ja         | -                | ${7:10}\n  nee              | nee        | ja               | ${8:15}\n  nee              | nee        | nee              | ${9:25};',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Decision table with multiple conditions',
    detail: 'Complex decision table'
  }],
  
  ['tijdlijn', {
    label: 'Tijdlijn expressie',
    kind: CompletionItemKind.Snippet,
    insertText: '${1:de} ${2:waarde} van ${3:parameter} vanaf ${4:startdatum} tot ${5:einddatum}',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Timeline expression for temporal values',
    detail: 'Timeline snippet'
  }],
  
  ['aggregatie', {
    label: 'Aggregatiefunctie',
    kind: CompletionItemKind.Snippet,
    insertText: '${1|de som,het gemiddelde,het maximum,het minimum,het aantal|} van ${2:verzameling}${3: waarbij ${4:conditie}}',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Aggregation function with optional filter',
    detail: 'Aggregation snippet'
  }],
  
  ['objectrel', {
    label: 'Objecttype met relatie',
    kind: CompletionItemKind.Snippet,
    insertText: 'Objecttype ${1:de} ${2:Persoon}\n  ${3:naam}: Tekst;\n  ${4:leeftijd}: Aantal;\n  ${5:partner}: ${6:Persoon};\n  ${7:kinderen}: ${8:Persoon}*;',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Object type with relationships',
    detail: 'Object relationship snippet'
  }],
  
  ['verdeling', {
    label: 'Verdeling regel',
    kind: CompletionItemKind.Snippet,
    insertText: 'Verdeling ${1:VerdeelKosten}\n  ${2:totaal}: ${3:1000} EUR\n  ${4:persoon1}: ${5:40} %\n  ${6:persoon2}: ${7:35} %\n  ${8:persoon3}: ${9:25} %;',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Distribution rule for dividing amounts',
    detail: 'Distribution snippet'
  }],
  
  ['recursie', {
    label: 'Recursieve regel',
    kind: CompletionItemKind.Snippet,
    insertText: 'Regel ${1:BerekenFactoriaal}\n  geldig indien ${2:n} > 0\n    ${3:Het} ${4:resultaat} wordt\n      indien ${5:n} = 1\n      dan 1\n      anders ${6:n} maal ${7:BerekenFactoriaal}(${8:n} min 1);',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Recursive rule pattern',
    detail: 'Recursion snippet'
  }],
  
  ['subselectie', {
    label: 'Subselectie',
    kind: CompletionItemKind.Snippet,
    insertText: '${1:de} ${2:verzameling} die ${3:conditie} ${4|voldoet aan,groter is dan,kleiner is dan,gelijk is aan|} ${5:waarde}',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Filtered collection (subselectie)',
    detail: 'Filter snippet'
  }],
  
  ['samengesteld', {
    label: 'Samengesteld predicaat',
    kind: CompletionItemKind.Snippet,
    insertText: 'Samengesteld predicaat ${1:AlleCriteriaVoldaan}\n  ${2|alle,geen van de,ten minste ${3:2},ten hoogste ${3:2},precies ${3:2}|} van onderstaande predicaten ${4|moeten,mogen|} waar zijn:\n  • ${5:predicaat1}\n  • ${6:predicaat2}\n  • ${7:predicaat3};',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Compound predicate with multiple conditions',
    detail: 'Compound predicate snippet'
  }],
  
  ['datum', {
    label: 'Datum berekening',
    kind: CompletionItemKind.Snippet,
    insertText: '${1:vandaag} ${2|plus,min|} ${3:30} ${4|dagen,maanden,jaren|}',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: 'Date arithmetic expression',
    detail: 'Date calculation snippet'
  }]
]);

// Handle completion requests
connection.onCompletion((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }
  
  const text = document.getText();
  const lines = text.split('\n');
  
  // Get the current word being typed
  const currentLine = lines[params.position.line];
  const beforeCursor = currentLine.substring(0, params.position.character);
  const wordMatch = beforeCursor.match(/(\w+)$/);
  const currentWord = wordMatch ? wordMatch[1].toLowerCase() : '';
  
  const completions: CompletionItem[] = [];
  
  // Check for snippet matches - always do this even if parser fails
  if (currentWord) {
    for (const [prefix, snippet] of snippets) {
      if (prefix.startsWith(currentWord)) {
        // Clone the snippet and adjust sort order
        const item = { ...snippet };
        item.sortText = '0000'; // Snippets first
        completions.push(item);
      }
    }
  } else {
    // If no current word, show all snippets at the beginning of a line
    const lineStart = currentLine.substring(0, params.position.character).trim() === '';
    if (lineStart) {
      for (const [prefix, snippet] of snippets) {
        const item = { ...snippet };
        item.sortText = '0000' + prefix; // Snippets first, ordered by prefix
        completions.push(item);
      }
    }
  }
  
  // Try to get parser suggestions, but don't fail if parser has issues
  try {
    const parser = new AntlrParser();
    
    // Convert VSCode position to character offset
    let offset = 0;
    for (let i = 0; i < params.position.line; i++) {
      offset += lines[i].length + 1; // +1 for newline
    }
    offset += params.position.character;
    
    // Get suggestions from the parser
    const suggestions = parser.getExpectedTokensAt(text, offset);
    
    // Convert to LSP CompletionItem format
    const parserCompletions = suggestions.map((suggestion, index) => {
      // Clean up suggestions - capitalize type names properly
      const cleaned = cleanSuggestion(suggestion);
      return {
        label: cleaned,
        kind: getCompletionItemKind(cleaned),
        sortText: String(1000 + index).padStart(4, '0'), // Parser suggestions after snippets
        insertText: cleaned
      };
    });
    
    completions.push(...parserCompletions);
  } catch (e) {
    // Parser errors are expected for incomplete code - just log for debugging
    console.error('Parser completion error (expected for incomplete code):', e.message);
  }
  
  return completions;
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

// Handle go to definition requests
connection.onDefinition((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }
  
  try {
    const parser = new AntlrParser();
    const { model } = parser.parseWithLocations(document.getText());
    
    // Find what's at the cursor position
    let node = findNodeAtPosition(model, params.position);
    if (!node) {
      return null;
    }
    
    
    // If it's a variable reference (parameter references in expressions are VariableReference nodes)
    if (node.type === 'VariableReference' && node.variableName) {
      // Search for parameter definition
      for (const param of model.parameters) {
        if (param.name === node.variableName) {
          const location = param.location;
          if (location) {
            return {
              uri: params.textDocument.uri,
              range: {
                start: { line: location.startLine - 1, character: location.startColumn },
                end: { line: location.endLine - 1, character: location.endColumn }
              }
            };
          }
        }
      }
    }
    
    // If it's a domain reference, find the domain definition
    if (node.type === 'DomainReference' && node.domain) {
      for (const domain of model.domains) {
        if (domain.name === node.domain) {
          const location = domain.location;
          if (location) {
            return {
              uri: params.textDocument.uri,
              range: {
                start: { line: location.startLine - 1, character: location.startColumn },
                end: { line: location.endLine - 1, character: location.endColumn }
              }
            };
          }
        }
      }
    }
    
    // If it's an object type reference, find its definition
    if ((node.type === 'ObjectTypeReference' || node.objectType) && (node.name || node.objectType)) {
      const typeName = node.objectType || node.name;
      for (const objType of model.objectTypes) {
        if (objType.name === typeName) {
          const location = objType.location;
          if (location) {
            return {
              uri: params.textDocument.uri,
              range: {
                start: { line: location.startLine - 1, character: location.startColumn },
                end: { line: location.endLine - 1, character: location.endColumn }
              }
            };
          }
        }
      }
    }
    
    return null;
  } catch (e) {
    console.error('Definition error:', e);
    return null;
  }
});

// Handle find references requests
connection.onReferences((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }
  
  try {
    const parser = new AntlrParser();
    const { model, locationMap } = parser.parseWithLocations(document.getText());
    
    // Find what symbol we're looking for
    const node = findNodeAtPosition(model, params.position);
    connection.console.log(`DEBUG onReferences: position=${params.position.line}:${params.position.character}, node=${node?.type || 'null'}, model.parameters=${model.parameters?.length || 0}`);
    if (!node) {
      connection.console.log('DEBUG: No node found at position, returning empty');
      return [];
    }
    
    // Get the symbol name to search for
    let symbolName: string | null = null;
    if (node.type === 'VariableReference' && node.variableName) {
      symbolName = node.variableName;
    } else if (node.type === 'ParameterDefinition' && node.name) {
      symbolName = node.name;
    }
    
    if (!symbolName) {
      return [];
    }
    
    // Find all references to this symbol
    const references: any[] = [];
    
    function collectReferences(node: any) {
      if (!node || typeof node !== 'object') return;
      
      // Check if this is a reference to our symbol
      if (node.type === 'VariableReference' && node.variableName === symbolName) {
        const location = locationMap?.get(node) || node.location;
        if (location) {
          references.push({
            uri: params.textDocument.uri,
            range: {
              start: { line: location.startLine - 1, character: location.startColumn },
              end: { line: location.endLine - 1, character: location.endColumn }
            }
          });
        }
      }
      
      // Include the definition if requested
      if (params.context.includeDeclaration) {
        if (node.type === 'ParameterDefinition' && node.name === symbolName) {
          const location = locationMap?.get(node) || node.location;
          if (location) {
            references.push({
              uri: params.textDocument.uri,
              range: {
                start: { line: location.startLine - 1, character: location.startColumn },
                end: { line: location.endLine - 1, character: location.endColumn }
              }
            });
          }
        }
      }
      
      // Recursively search all properties
      for (const key of Object.keys(node)) {
        const value = node[key];
        if (value && typeof value === 'object') {
          if (Array.isArray(value)) {
            value.forEach(collectReferences);
          } else {
            collectReferences(value);
          }
        }
      }
    }
    
    collectReferences(model);
    return references;
  } catch (e) {
    console.error('References error:', e);
    return [];
  }
});

// Handle code actions (quick fixes)
connection.onCodeAction((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }
  
  const actions: CodeAction[] = [];
  const diagnostics = params.context.diagnostics;
  connection.console.log(`DEBUG onCodeAction: ${diagnostics.length} diagnostics in context`);
  
  for (const diagnostic of diagnostics) {
    const message = diagnostic.message;
    
    // Fix for "Unknown parameter" errors
    if (message.includes('Unknown parameter:')) {
      const match = message.match(/Unknown parameter:\s*(\w+)/);
      if (match) {
        const paramName = match[1];
        
        // Find where to insert the parameter (at the beginning of the file)
        const lines = document.getText().split('\n');
        let insertLine = 0;
        
        // Find the first non-empty line or after existing parameters
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('Parameter')) {
            insertLine = i + 1;
          } else if (insertLine === 0 && lines[i].trim() && !lines[i].trim().startsWith('#')) {
            insertLine = i;
            break;
          }
        }
        
        const action: CodeAction = {
          title: `Create parameter '${paramName}'`,
          kind: CodeActionKind.QuickFix,
          edit: {
            changes: {
              [params.textDocument.uri]: [{
                range: {
                  start: { line: insertLine, character: 0 },
                  end: { line: insertLine, character: 0 }
                },
                newText: `Parameter ${paramName}: Bedrag;\n`
              }]
            }
          }
        };
        actions.push(action);
      }
    }
    
    // Fix for "mismatched input 'is' expecting ':'"
    if (message.includes("mismatched input 'is'") && message.includes("expecting ':'")) {
      // Find 'is een' pattern and replace with ':'
      const lineNumber = diagnostic.range.start.line;
      const line = document.getText().split('\n')[lineNumber];
      const isEenMatch = line.match(/(\s+)is\s+een\s+/);
      
      if (isEenMatch) {
        const startChar = line.indexOf('is een');
        const endChar = startChar + 6; // length of 'is een'
        
        const action: CodeAction = {
          title: 'Replace "is een" with ":"',
          kind: CodeActionKind.QuickFix,
          edit: {
            changes: {
              [params.textDocument.uri]: [{
                range: {
                  start: { line: lineNumber, character: startChar },
                  end: { line: lineNumber, character: endChar }
                },
                newText: ':'
              }]
            }
          }
        };
        actions.push(action);
      }
    }
    
    // Fix for missing semicolon
    if (message.includes("expecting ';'") || message.includes("missing ';'")) {
      const lineNumber = diagnostic.range.start.line;
      const line = document.getText().split('\n')[lineNumber];
      const trimmedLine = line.trimEnd();
      
      if (!trimmedLine.endsWith(';')) {
        const action: CodeAction = {
          title: 'Add missing semicolon',
          kind: CodeActionKind.QuickFix,
          edit: {
            changes: {
              [params.textDocument.uri]: [{
                range: {
                  start: { line: lineNumber, character: trimmedLine.length },
                  end: { line: lineNumber, character: trimmedLine.length }
                },
                newText: ';'
              }]
            }
          }
        };
        actions.push(action);
      }
    }
    
    // Fix for "parameter" instead of "Parameter" (capitalization)
    if (message.includes("mismatched input 'parameter'")) {
      const lineNumber = diagnostic.range.start.line;
      const line = document.getText().split('\n')[lineNumber];
      const paramMatch = line.match(/^(\s*)parameter\s+/i);  // case insensitive
      
      if (paramMatch) {
        const startChar = paramMatch[1].length;
        const endChar = startChar + 9; // length of 'parameter'
        
        const action: CodeAction = {
          title: 'Capitalize "parameter" to "Parameter"',
          kind: CodeActionKind.QuickFix,
          edit: {
            changes: {
              [params.textDocument.uri]: [{
                range: {
                  start: { line: lineNumber, character: startChar },
                  end: { line: lineNumber, character: endChar }
                },
                newText: 'Parameter'
              }]
            }
          }
        };
        actions.push(action);
      }
    }
    
    // Fix for missing "geldig" in rules
    if (message.includes("expecting 'geldig'") || 
        (message.includes("no viable alternative") && diagnostic.range.start.line > 0)) {
      // Check if this is likely a rule that's missing "geldig"
      const lineNumber = diagnostic.range.start.line;
      const lines = document.getText().split('\n');
      
      // Look for "Regel" on previous line
      if (lineNumber > 0 && lines[lineNumber - 1].trim().startsWith('Regel')) {
        const currentLine = lines[lineNumber];
        const leadingWhitespace = currentLine.match(/^\s*/)?.[0] || '';
        
        // If current line doesn't start with "geldig"
        if (!currentLine.trim().startsWith('geldig')) {
          const action: CodeAction = {
            title: 'Add "geldig altijd"',
            kind: CodeActionKind.QuickFix,
            edit: {
              changes: {
                [params.textDocument.uri]: [{
                  range: {
                    start: { line: lineNumber, character: 0 },
                    end: { line: lineNumber, character: 0 }
                  },
                  newText: `${leadingWhitespace}geldig altijd\n`
                }]
              }
            }
          };
          actions.push(action);
        }
      }
    }
    
    // Fix for "=" instead of "wordt"
    if (message.includes("mismatched input '='") && message.includes("expecting 'wordt'")) {
      const lineNumber = diagnostic.range.start.line;
      const line = document.getText().split('\n')[lineNumber];
      const equalMatch = line.match(/(\s*)=\s*/);
      
      if (equalMatch) {
        const startChar = line.indexOf('=');
        const endChar = startChar + 1;
        
        const action: CodeAction = {
          title: 'Replace "=" with "wordt"',
          kind: CodeActionKind.QuickFix,
          edit: {
            changes: {
              [params.textDocument.uri]: [{
                range: {
                  start: { line: lineNumber, character: startChar },
                  end: { line: lineNumber, character: endChar }
                },
                newText: 'wordt'
              }]
            }
          }
        };
        actions.push(action);
      }
    }
    
    // Fix for minus sign instead of "min"
    if (message.includes("no viable alternative") && message.includes("-")) {
      const lineNumber = diagnostic.range.start.line;
      const line = document.getText().split('\n')[lineNumber];
      const minusMatch = line.match(/(\s+)-(\s+)/);
      
      if (minusMatch) {
        const startChar = line.indexOf(minusMatch[0]);
        const endChar = startChar + minusMatch[0].length;
        
        const action: CodeAction = {
          title: 'Replace "-" with "min"',
          kind: CodeActionKind.QuickFix,
          edit: {
            changes: {
              [params.textDocument.uri]: [{
                range: {
                  start: { line: lineNumber, character: startChar },
                  end: { line: lineNumber, character: endChar }
                },
                newText: ' min '
              }]
            }
          }
        };
        actions.push(action);
      }
    }
    
    // Fix for division sign instead of "gedeeld door"
    if (message.includes("no viable alternative") && message.includes("/")) {
      const lineNumber = diagnostic.range.start.line;
      const line = document.getText().split('\n')[lineNumber];
      const divMatch = line.match(/(\s+)\/(\s+)/);
      
      if (divMatch) {
        const startChar = line.indexOf(divMatch[0]);
        const endChar = startChar + divMatch[0].length;
        
        const action: CodeAction = {
          title: 'Replace "/" with "gedeeld door"',
          kind: CodeActionKind.QuickFix,
          edit: {
            changes: {
              [params.textDocument.uri]: [{
                range: {
                  start: { line: lineNumber, character: startChar },
                  end: { line: lineNumber, character: endChar }
                },
                newText: ' gedeeld door '
              }]
            }
          }
        };
        actions.push(action);
      }
    }
    
    // Fix for "if" instead of "indien"
    if (message.includes("no viable alternative") && message.includes("if")) {
      const lineNumber = diagnostic.range.start.line;
      const line = document.getText().split('\n')[lineNumber];
      const ifMatch = line.match(/\bif\b/i);
      
      if (ifMatch) {
        const startChar = line.toLowerCase().indexOf('if');
        if (startChar >= 0) {
          const endChar = startChar + 2;
          
          const action: CodeAction = {
            title: 'Replace "if" with "indien"',
            kind: CodeActionKind.QuickFix,
            edit: {
              changes: {
                [params.textDocument.uri]: [{
                  range: {
                    start: { line: lineNumber, character: startChar },
                    end: { line: lineNumber, character: endChar }
                  },
                  newText: 'indien'
                }]
              }
            }
          };
          actions.push(action);
        }
      }
    }
    
    // Fix for "Rule" instead of "Regel"
    if (message.includes("extraneous input 'Rule'") || message.includes("mismatched input 'Rule'")) {
      const lineNumber = diagnostic.range.start.line;
      const line = document.getText().split('\n')[lineNumber];
      const ruleMatch = line.match(/\bRule\b/);
      
      if (ruleMatch) {
        const startChar = line.indexOf('Rule');
        const endChar = startChar + 4;
        
        const action: CodeAction = {
          title: 'Replace "Rule" with "Regel"',
          kind: CodeActionKind.QuickFix,
          edit: {
            changes: {
              [params.textDocument.uri]: [{
                range: {
                  start: { line: lineNumber, character: startChar },
                  end: { line: lineNumber, character: endChar }
                },
                newText: 'Regel'
              }]
            }
          }
        };
        actions.push(action);
      }
    }
    
    // Fix for misspelled "Parameter" keywords
    if (message.includes("mismatched input 'Paramater'") || 
        message.includes("mismatched input 'Paramter'") ||
        message.includes("mismatched input 'Parmaeter'")) {
      const lineNumber = diagnostic.range.start.line;
      const line = document.getText().split('\n')[lineNumber];
      const misspelledMatch = line.match(/\b(Paramater|Paramter|Parmaeter)\b/);
      
      if (misspelledMatch) {
        const misspelled = misspelledMatch[1];
        const startChar = line.indexOf(misspelled);
        const endChar = startChar + misspelled.length;
        
        const action: CodeAction = {
          title: `Fix spelling: "${misspelled}" → "Parameter"`,
          kind: CodeActionKind.QuickFix,
          edit: {
            changes: {
              [params.textDocument.uri]: [{
                range: {
                  start: { line: lineNumber, character: startChar },
                  end: { line: lineNumber, character: endChar }
                },
                newText: 'Parameter'
              }]
            }
          }
        };
        actions.push(action);
      }
    }
    
    // Fix for missing colon in parameter declaration
    if (message.includes("mismatched input ';' expecting ':'")) {
      const lineNumber = diagnostic.range.start.line;
      const line = document.getText().split('\n')[lineNumber];
      
      // Look for pattern like "Parameter naam;" where colon is missing
      const paramMatch = line.match(/^(\s*Parameter\s+\w+)(\s*);/);
      
      if (paramMatch) {
        const beforeSemicolon = paramMatch[1].length;
        
        const action: CodeAction = {
          title: 'Add missing colon before type',
          kind: CodeActionKind.QuickFix,
          edit: {
            changes: {
              [params.textDocument.uri]: [{
                range: {
                  start: { line: lineNumber, character: beforeSemicolon },
                  end: { line: lineNumber, character: beforeSemicolon }
                },
                newText: ': Bedrag'
              }]
            }
          }
        };
        actions.push(action);
      }
    }
  }
  
  return actions;
});

// Handle semantic tokens requests
connection.onRequest('textDocument/semanticTokens/full', (params: SemanticTokensParams): SemanticTokens => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return { data: [] };
  }
  
  const builder = new SemanticTokensBuilder();
  const text = document.getText();
  
  // Use AST-based approach with location tracking
  try {
    const parser = new AntlrParser();
    const { model } = parser.parseWithLocations(text);
    
    // Walk AST and use node.location directly
    const walkNode = (node: any) => {
      if (!node || typeof node !== 'object') return;
      
      // Use node.location directly - no more WeakMap
      const location = node.location;
      if (location && node.type) {
        // Map node types to semantic token types
        let tokenType: string | undefined;
        let modifiers: string[] = [];
        
        switch (node.type) {
          // Declarations
          case 'ParameterDefinition':
            // Highlight just the parameter name, not the whole definition
            if (node.name && location) {
              // For now, use the whole node location
              // TODO: Extract name-specific location from parser
              tokenType = SemanticTokenTypes.variable;
              modifiers = [SemanticTokenModifiers.declaration];
            }
            break;
          
          case 'ObjectTypeDefinition':
            tokenType = SemanticTokenTypes.class;
            modifiers = [SemanticTokenModifiers.declaration];
            break;
          
          case 'Rule':
            tokenType = SemanticTokenTypes.function;
            modifiers = [SemanticTokenModifiers.declaration];
            break;
          
          case 'DomainDefinition':
            tokenType = SemanticTokenTypes.namespace;
            modifiers = [SemanticTokenModifiers.declaration];
            break;
          
          // References and literals
          case 'VariableReference':
            tokenType = SemanticTokenTypes.variable;
            // Check if it's a parameter reference vs object reference
            if (node.variableName) {
              // Could check against known parameters to be more precise
              tokenType = SemanticTokenTypes.variable;
            }
            break;
          
          case 'NavigationExpression':
            // The attribute being accessed
            tokenType = SemanticTokenTypes.property;
            break;
          
          case 'AttributeReference':
            tokenType = SemanticTokenTypes.property;
            break;
          
          case 'NumberLiteral':
            tokenType = SemanticTokenTypes.number;
            break;
          
          case 'StringLiteral':
            tokenType = SemanticTokenTypes.string;
            break;
          
          case 'BooleanLiteral':
            tokenType = SemanticTokenTypes.keyword; // true/false are keywords
            break;
          
          case 'FunctionCall':
            tokenType = SemanticTokenTypes.function;
            break;
          
          // Types
          case 'DataType':
          case 'DomainReference':
            tokenType = SemanticTokenTypes.type;
            break;
          
          // Operators and keywords handled by regex fallback
          case 'BinaryExpression':
          case 'UnaryExpression':
          case 'Gelijkstelling':
          case 'RuleVersion':
            // These don't need tokens themselves, just their contents
            break;
        }
        
        if (tokenType) {
          const typeIndex = tokenTypeMap.get(tokenType);
          if (typeIndex !== undefined) {
            let modifierBits = 0;
            for (const mod of modifiers) {
              const bit = tokenModifierMap.get(mod);
              if (bit) modifierBits |= bit;
            }
            
            // ANTLR locations are 1-based lines, 0-based columns
            const line = location.startLine - 1;
            const char = location.startColumn;
            const length = location.endColumn - location.startColumn + 1;
            
            if (line >= 0 && char >= 0 && length > 0) {
              builder.push(line, char, length, typeIndex, modifierBits);
            }
          }
        }
      }
      
      // Recursively walk children
      for (const key in node) {
        const value = node[key];
        if (Array.isArray(value)) {
          value.forEach(walkNode);
        } else if (typeof value === 'object' && value !== null && key !== 'location') {
          walkNode(value);
        }
      }
    };
    
    // Walk the entire model
    walkNode(model);
    
    return builder.build();
  } catch (e) {
    // Fall back to regex approach if AST parsing fails
    console.log('AST parsing failed, using regex fallback:', e);
  }
  
  // Fallback: Only highlight keywords/operators that AST doesn't track
  // This provides basic highlighting when parsing fails
  const lines = text.split('\n');
  
  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    
    // Match RegelSpraak keywords (not tracked as separate AST nodes)
    const keywords = /\b(Parameter|Regel|Objecttype|Domein|Beslistabel|Feittype|geldig|altijd|indien|wordt|moet|als|dan|van|de|het|een|is|zijn|met|eenheid|voor|elke|dag)\b/g;
    let match;
    while ((match = keywords.exec(line)) !== null) {
      builder.push(lineNum, match.index, match[0].length, 
        tokenTypeMap.get(SemanticTokenTypes.keyword)!, 0);
    }
    
    // Match type keywords
    const types = /\b(Bedrag|Numeriek|Tekst|Datum|Boolean|Percentage|Duur|geheel getal|getal)\b/g;
    while ((match = types.exec(line)) !== null) {
      builder.push(lineNum, match.index, match[0].length,
        tokenTypeMap.get(SemanticTokenTypes.type)!, 0);
    }
    
    // Basic operators (AST doesn't give these separate locations)
    const operators = /(\+|-|\*|\/|=|<|>|<=|>=|!=)/g;
    while ((match = operators.exec(line)) !== null) {
      builder.push(lineNum, match.index, match[0].length,
        tokenTypeMap.get(SemanticTokenTypes.operator)!, 0);
    }
  }
  
  return builder.build();
  
  /* TODO: Re-enable AST-based approach once locations are properly tracked
  try {
    // Parse with locations to get AST and location info
    const parser = new AntlrParser();
    const { model, locationMap } = parser.parseWithLocations(text);
    const analyzer = new SemanticAnalyzer();
    
    // Build a simple symbol map for reference resolution
    const symbols = new Map<string, string>();
    
    // Collect parameters
    if (model.parameters) {
      for (const param of model.parameters) {
        if (param.name) symbols.set(param.name, 'parameter');
      }
    }
    
    // Collect object types
    if (model.objectTypes) {
      for (const objType of model.objectTypes) {
        if (objType.name) symbols.set(objType.name, 'object_type');
      }
    }
    
    // Collect domains
    if (model.domains) {
      for (const domain of model.domains) {
        if (domain.name) symbols.set(domain.name, 'domain');
      }
    }
    
    // Helper function to add a token
    const addToken = (
      location: any, 
      tokenType: string, 
      tokenModifiers: string[] = []
    ) => {
      if (!location) return;
      
      const startLine = (location.start?.line || location.line || 1) - 1;
      const startChar = location.start?.column || location.column || 0;
      const endLine = location.stop?.line || location.end?.line || startLine + 1;
      const endChar = location.stop?.column || location.end?.column || startChar + 10;
      
      // Calculate length (handle multi-line tokens)
      let length = endChar - startChar + 1;
      if (endLine > startLine + 1) {
        // For multi-line, just highlight first line
        const lineEnd = text.indexOf('\n', document.offsetAt({ line: startLine, character: 0 }));
        length = lineEnd - document.offsetAt({ line: startLine, character: startChar });
      }
      
      const typeIndex = tokenTypeMap.get(tokenType);
      if (typeIndex === undefined) return;
      
      let modifierBits = 0;
      for (const mod of tokenModifiers) {
        const bit = tokenModifierMap.get(mod);
        if (bit) modifierBits |= bit;
      }
      
      builder.push(startLine, startChar, length, typeIndex, modifierBits);
    };
    
    // Walk the AST and generate tokens
    const visitNode = (node: any) => {
      if (!node) return;
      
      const location = locationMap?.get(node);
      
      // Handle different node types
      switch (node.type) {
        case 'ParameterDefinition':
          // "Parameter" keyword would be separate, here we mark the name
          if (location && node.name) {
            // Find "Parameter" keyword location in text
            const lineStart = document.offsetAt({ line: location.start.line - 1, character: 0 });
            const lineText = text.substring(lineStart, text.indexOf('\n', lineStart));
            const keywordIndex = lineText.indexOf('Parameter');
            if (keywordIndex >= 0) {
              addToken(
                { start: { line: location.start.line, column: keywordIndex }, 
                  stop: { line: location.start.line, column: keywordIndex + 8 } },
                SemanticTokenTypes.keyword
              );
            }
            // Add parameter name as declaration
            const nameMatch = lineText.match(/Parameter\s+(?:de\s+|het\s+)?(\w+)/);
            if (nameMatch) {
              const nameStart = lineText.indexOf(nameMatch[1]);
              addToken(
                { start: { line: location.start.line, column: nameStart },
                  stop: { line: location.start.line, column: nameStart + nameMatch[1].length - 1 } },
                SemanticTokenTypes.variable,
                [SemanticTokenModifiers.declaration]
              );
            }
          }
          break;
          
        case 'ObjectTypeDefinition':
          if (location && node.name) {
            // Mark "Objecttype" keyword
            const lineStart = document.offsetAt({ line: location.start.line - 1, character: 0 });
            const lineText = text.substring(lineStart, text.indexOf('\n', lineStart));
            const keywordIndex = lineText.indexOf('Objecttype');
            if (keywordIndex >= 0) {
              addToken(
                { start: { line: location.start.line, column: keywordIndex },
                  stop: { line: location.start.line, column: keywordIndex + 9 } },
                SemanticTokenTypes.keyword
              );
            }
            // Add object type name
            const nameMatch = lineText.match(/Objecttype\s+(\w+)/);
            if (nameMatch) {
              const nameStart = lineText.indexOf(nameMatch[1]);
              addToken(
                { start: { line: location.start.line, column: nameStart },
                  stop: { line: location.start.line, column: nameStart + nameMatch[1].length - 1 } },
                SemanticTokenTypes.class,
                [SemanticTokenModifiers.declaration]
              );
            }
          }
          // Visit members
          if (node.members) {
            for (const member of node.members) {
              visitNode(member);
            }
          }
          break;
          
        case 'VariableReference':
          if (location && node.name) {
            // Check if it's a parameter or object type reference
            const symbolKind = symbols.get(node.name);
            const tokenType = symbolKind === 'parameter' ? SemanticTokenTypes.variable :
                            symbolKind === 'object_type' ? SemanticTokenTypes.class :
                            symbolKind === 'domain' ? SemanticTokenTypes.namespace :
                            SemanticTokenTypes.variable;
            addToken(location, tokenType);
          }
          break;
          
        case 'FunctionCall':
          if (location && node.name) {
            addToken(location, SemanticTokenTypes.function, 
              node.isBuiltin ? [SemanticTokenModifiers.defaultLibrary] : []);
          }
          // Visit arguments
          if (node.arguments) {
            for (const arg of node.arguments) {
              visitNode(arg);
            }
          }
          break;
          
        case 'Literal':
          if (location) {
            if (typeof node.value === 'number') {
              addToken(location, SemanticTokenTypes.number);
            } else if (typeof node.value === 'string') {
              addToken(location, SemanticTokenTypes.string);
            }
          }
          break;
          
        case 'BinaryExpression':
        case 'UnaryExpression':
          if (location && node.operator) {
            // We'd need to find the operator position in the text
            // For now, visit operands
            visitNode(node.left);
            visitNode(node.right);
            visitNode(node.operand);
          }
          break;
          
        case 'Rule':
        case 'Gelijkstelling':
        case 'Initialisatie':
          // Mark "Regel" keyword
          if (location) {
            const lineStart = document.offsetAt({ line: location.start.line - 1, character: 0 });
            const lineText = text.substring(lineStart, text.indexOf('\n', lineStart));
            const keywordIndex = lineText.indexOf('Regel');
            if (keywordIndex >= 0) {
              addToken(
                { start: { line: location.start.line, column: keywordIndex },
                  stop: { line: location.start.line, column: keywordIndex + 4 } },
                SemanticTokenTypes.keyword
              );
            }
          }
          // Visit conditions and body
          if (node.conditions) {
            for (const cond of node.conditions) {
              visitNode(cond);
            }
          }
          if (node.body) {
            visitNode(node.body);
          }
          if (node.expression) {
            visitNode(node.expression);
          }
          break;
          
        case 'DomainDefinition':
          if (location && node.name) {
            addToken(location, SemanticTokenTypes.namespace, 
              [SemanticTokenModifiers.declaration]);
          }
          // Visit domain values
          if (node.values) {
            for (const value of node.values) {
              visitNode(value);
            }
          }
          break;
          
        case 'DomainValue':
          if (location) {
            addToken(location, SemanticTokenTypes.enum);
          }
          break;
          
        case 'DecisionTable':
          // Mark "Beslistabel" keyword
          if (location) {
            const lineStart = document.offsetAt({ line: location.start.line - 1, character: 0 });
            const lineText = text.substring(lineStart, text.indexOf('\n', lineStart));
            const keywordIndex = lineText.indexOf('Beslistabel');
            if (keywordIndex >= 0) {
              addToken(
                { start: { line: location.start.line, column: keywordIndex },
                  stop: { line: location.start.line, column: keywordIndex + 10 } },
                SemanticTokenTypes.keyword
              );
            }
          }
          break;
          
        default:
          // Recursively visit children for unknown types
          if (typeof node === 'object') {
            for (const key in node) {
              const value = node[key];
              if (Array.isArray(value)) {
                for (const item of value) {
                  visitNode(item);
                }
              } else if (typeof value === 'object' && value !== null) {
                visitNode(value);
              }
            }
          }
      }
    };
    
    // Visit all top-level elements
    if (model.parameters) {
      for (const param of model.parameters) {
        visitNode(param);
      }
    }
    if (model.objectTypes) {
      for (const objType of model.objectTypes) {
        visitNode(objType);
      }
    }
    if (model.rules) {
      for (const rule of model.rules) {
        visitNode(rule);
      }
    }
    if (model.domains) {
      for (const domain of model.domains) {
        visitNode(domain);
      }
    }
    if (model.decisionTables) {
      for (const table of model.decisionTables) {
        visitNode(table);
      }
    }
    if (model.dimensions) {
      for (const dim of model.dimensions) {
        visitNode(dim);
      }
    }
    
    return builder.build();
  } catch (e) {
    // Return empty tokens on parse error
    console.error('Semantic tokens error:', e);
    return { data: [] };
  }
  */
});

// Handle format document requests
connection.onDocumentFormatting((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }
  
  try {
    const parser = new AntlrParser();
    const parseResult = parser.parseWithLocations(document.getText());
    
    // Check if parsing succeeded
    if (!parseResult || !parseResult.model) {
      console.error('No model returned from parser');
      return [];
    }
    
    
    // Format the AST back to text
    const formatted = formatModel(parseResult.model);
    
    // Return a single edit that replaces the entire document
    const text = document.getText();
    const lines = text.split('\n');
    const lastLine = lines[lines.length - 1];
    
    return [{
      range: {
        start: { line: 0, character: 0 },
        end: { line: lines.length - 1, character: lastLine.length }
      },
      newText: formatted
    }];
  } catch (e: any) {
    // If parsing fails, don't format
    console.error('Format error:', e.message || e);
    console.error('Stack:', e.stack);
    return [];
  }
});

// Simple formatter that reconstructs the document from AST
function formatModel(model: any): string {
  const lines: string[] = [];
  
  // Format parameters
  if (model.parameters && model.parameters.length > 0) {
    // Find the longest parameter name for alignment
    const maxNameLength = Math.max(...model.parameters.map((p: any) => p.name.length));
    
    for (const param of model.parameters) {
      const name = param.name.padEnd(maxNameLength);
      let type = '';
      
      if (param.dataType) {
        if (param.dataType.type === 'DomainReference' && param.dataType.domain) {
          type = param.dataType.domain;
        } else if (param.dataType.type === 'Numeriek' && param.dataType.specification) {
          type = `Numeriek (${param.dataType.specification})`;
        } else if (param.dataType.type) {
          type = param.dataType.type;
        }
      }
      
      const unit = param.unit ? ` met eenheid ${param.unit}` : '';
      lines.push(`Parameter ${name}: ${type}${unit};`);
    }
    lines.push('');
  }
  
  // Format domains
  if (model.domains && model.domains.length > 0) {
    for (const domain of model.domains) {
      const values = domain.values.map((v: string) => `'${v}'`).join(', ');
      lines.push(`Domein ${domain.name}: ${values};`);
    }
    lines.push('');
  }
  
  // Format object types  
  if (model.objectTypes && model.objectTypes.length > 0) {
    for (const objType of model.objectTypes) {
      lines.push(`Objecttype ${objType.name}`);
      for (const member of objType.members) {
        if (member.type === 'AttributeSpecification') {
          let type = '';
          if (member.dataType?.type) {
            type = member.dataType.type;
          }
          const unit = member.unit ? ` met eenheid ${member.unit}` : '';
          lines.push(`  ${member.name}: ${type}${unit}`);
        }
      }
      lines.push('');
    }
  }
  
  // Format rules (note: they're called 'regels' in the model, not 'rules')
  if (model.regels && model.regels.length > 0) {
    for (const rule of model.regels) {
      lines.push(`Regel ${rule.name}`);
      
      // Format validity - properly handle both version.validity and condition
      let validityLine = '  geldig ';
      if (rule.condition && rule.condition.expression) {
        // Rule has a condition (indien)
        validityLine += `indien ${formatExpression(rule.condition.expression)}`;
      } else if (rule.version && rule.version.validity) {
        // Rule has version validity
        validityLine += rule.version.validity;
      } else {
        // Default to altijd
        validityLine += 'altijd';
      }
      lines.push(validityLine);
      
      // Format result if present
      if (rule.result) {
        const resultLines = formatResult(rule.result, '    ');
        lines.push(...resultLines);
      }
      lines.push('');
    }
  }
  
  return lines.join('\n');
}

// Helper function to format expressions
function formatExpression(expr: any): string {
  if (!expr) return '';
  
  switch (expr.type) {
    case 'NumberLiteral':
      return expr.value.toString();
    
    case 'StringLiteral':
      return `'${expr.value}'`;
    
    case 'BooleanLiteral':
      return expr.value ? 'waar' : 'onwaar';
    
    case 'VariableReference':
      return expr.variableName;
    
    case 'AttributeReference':
      return expr.path.join('.');
    
    case 'BinaryExpression':
      const left = formatExpression(expr.left);
      const right = formatExpression(expr.right);
      let op = expr.operator;
      // Convert operators to Dutch if needed
      if (op === '+') op = 'plus';
      if (op === '-') op = 'min';
      if (op === '*') op = 'maal';
      if (op === '/') op = 'gedeeld door';
      if (op === '==') op = '=';
      if (op === '!=') op = '<>';
      return `${left} ${op} ${right}`;
    
    case 'UnaryExpression':
      const operand = formatExpression(expr.operand);
      if (expr.operator === 'niet' || expr.operator === '!') {
        return `niet ${operand}`;
      }
      return `${expr.operator}${operand}`;
    
    case 'FunctionCall':
      const args = expr.arguments.map(formatExpression).join(', ');
      return `${expr.functionName}(${args})`;
    
    case 'NavigationExpression':
      const obj = formatExpression(expr.object);
      return `${expr.attribute} van ${obj}`;
    
    case 'AggregationExpression':
      const target = formatExpression(expr.target);
      return `${expr.aggregationType} van ${target}`;
    
    case 'ConditionalExpression':
      const cond = formatExpression(expr.condition);
      const thenExpr = formatExpression(expr.then);
      const elseExpr = formatExpression(expr.else);
      return `indien ${cond} dan ${thenExpr} anders ${elseExpr}`;
    
    default:
      // For unknown types, try to extract meaningful info
      if (expr.value !== undefined) {
        return String(expr.value);
      }
      return '[expression]';
  }
}

// Helper function to format result parts
function formatResult(result: any, indent: string): string[] {
  const lines: string[] = [];
  
  if (!result) return lines;
  
  switch (result.type) {
    case 'Gelijkstelling':
      // Format as "Het/De attribute van object moet berekend worden als expression"
      if (result.target && result.target.type === 'AttributeReference') {
        const path = result.target.path || [];
        let formatted = indent;
        
        // Add article (Het/De) - default to Het for now
        formatted += 'Het ';
        
        // Add attribute path
        if (path.length > 1) {
          // Has object reference: "attribute van object"
          // The path is [attribute, object] so we need the first element and "van" the rest
          formatted += `${path[0]} van een ${path.slice(1).join('.')}`;
        } else if (path.length === 1) {
          // Just attribute
          formatted += path[0];
        } else {
          formatted += 'resultaat';
        }
        
        // Add the assignment part
        formatted += ' moet berekend worden als ';
        formatted += formatExpression(result.expression);
        formatted += '.';
        
        lines.push(formatted);
      } else {
        // Fallback for other target types
        const target = formatExpression(result.target);
        const expr = formatExpression(result.expression);
        lines.push(`${indent}${target} wordt ${expr}.`);
      }
      break;
    
    case 'MultipleResults':
      for (const r of result.results) {
        lines.push(...formatResult(r, indent));
      }
      break;
    
    case 'ObjectCreation':
      // Format as "Er wordt een nieuw Type aangemaakt"
      lines.push(`${indent}Er wordt een nieuw ${result.objectType} aangemaakt`);
      if (result.attributeInits && result.attributeInits.length > 0) {
        for (let i = 0; i < result.attributeInits.length; i++) {
          const init = result.attributeInits[i];
          const value = formatExpression(init.value);
          if (i === 0) {
            lines.push(`${indent}met ${init.attribute} ${value}`);
          } else {
            lines.push(`${indent}en ${init.attribute} ${value}`);
          }
        }
      }
      lines[lines.length - 1] += '.';
      break;
    
    case 'Kenmerktoekenning':
      const subject = formatExpression(result.subject);
      lines.push(`${indent}${subject} heeft kenmerk ${result.characteristic}.`);
      break;
    
    case 'Consistentieregel':
      if (result.criteriumType === 'uniek') {
        const target = formatExpression(result.target);
        lines.push(`${indent}${target} is uniek.`);
      } else {
        lines.push(`${indent}inconsistent indien ${formatExpression(result.condition)}.`);
      }
      break;
    
    case 'Verdeling':
      const source = formatExpression(result.sourceAmount);
      const collection = formatExpression(result.targetCollection);
      lines.push(`${indent}Verdeel ${source} over ${collection}.`);
      break;
    
    case 'Initialisatie':
      // Format as "Het/De target wordt expression"
      if (result.target) {
        const target = formatExpression(result.target);
        const expr = formatExpression(result.expression);
        lines.push(`${indent}${target} wordt ${expr};`);
      }
      break;
    
    default:
      // Fallback - just show we have a result
      lines.push(`${indent}[regel resultaat].`);
      break;
  }
  
  return lines;
}

documents.listen(connection);
connection.listen();