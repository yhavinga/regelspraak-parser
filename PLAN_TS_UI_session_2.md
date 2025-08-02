# RegelSpraak UI Session 2: TypeScript Parser Integration

**Goal**: Integrate the TypeScript RegelSpraak parser with real-time validation and error decorations.

**Duration**: 4-6 hours

**Prerequisites**: Completed Session 1, TypeScript parser working in `/typescript`

## Deliverables

1. Web Worker running TypeScript parser
2. Real-time parsing with debouncing
3. Error decorations in Monaco
4. AST explorer panel
5. Performance optimization for large files

## Implementation Steps

### 1. Copy Parser Files (30 min)

First, we need to make the parser available to the frontend:

```bash
cd /home/yeb/regelspraak-parser/frontend

# Create parser directory
mkdir -p src/lib/parser/regelspraak

# Copy the TypeScript implementation (we'll bundle what we need)
cp -r ../typescript/src/ast src/lib/parser/regelspraak/
cp -r ../typescript/src/interfaces src/lib/parser/regelspraak/
cp ../typescript/src/parsers/antlr-parser.ts src/lib/parser/regelspraak/
cp ../typescript/src/visitors/regelspraak-visitor-impl.ts src/lib/parser/regelspraak/
cp ../typescript/src/semantic-analyzer.ts src/lib/parser/regelspraak/
cp -r ../typescript/src/generated/antlr src/lib/parser/regelspraak/

# Install ANTLR runtime
npm install antlr4
```

### 2. Parser Worker Setup (1 hour)

Create `src/lib/parser/parser-worker.ts`:

```typescript
import { AntlrParser } from './regelspraak/antlr-parser';
import { SemanticAnalyzer } from './regelspraak/semantic-analyzer';
import { DomainModel } from './regelspraak/ast/domain-model';
import { SourceSpan } from './regelspraak/ast/common';

interface ParseRequest {
  id: string;
  code: string;
  validateOnly?: boolean;
}

interface ParseResult {
  id: string;
  success: boolean;
  model?: DomainModel;
  errors: ParseError[];
  warnings: ParseWarning[];
  parseTime: number;
}

interface ParseError {
  message: string;
  severity: 'error' | 'warning';
  span?: SourceSpan;
  quickFix?: QuickFix;
}

interface QuickFix {
  title: string;
  edits: TextEdit[];
}

interface TextEdit {
  span: SourceSpan;
  newText: string;
}

// Parser instance (reused for performance)
const parser = new AntlrParser();
const analyzer = new SemanticAnalyzer();

// Handle parse requests
self.addEventListener('message', async (event: MessageEvent<ParseRequest>) => {
  const { id, code, validateOnly } = event.data;
  const startTime = performance.now();
  
  try {
    // Parse the code
    const parseResult = parser.parse(code);
    
    if (!parseResult.success) {
      const result: ParseResult = {
        id,
        success: false,
        errors: [{
          message: parseResult.error?.message || 'Parse error',
          severity: 'error',
          span: parseResult.error?.span
        }],
        warnings: [],
        parseTime: performance.now() - startTime
      };
      self.postMessage(result);
      return;
    }
    
    // Perform semantic analysis
    const model = parseResult.value!;
    const validationResult = analyzer.analyze(model);
    
    // Convert semantic errors to parse errors
    const errors: ParseError[] = validationResult.errors.map(err => ({
      message: err.message,
      severity: 'error' as const,
      span: err.span,
      quickFix: generateQuickFix(err, model)
    }));
    
    // Add warnings (future enhancement)
    const warnings: ParseWarning[] = [];
    
    const result: ParseResult = {
      id,
      success: errors.length === 0,
      model: validateOnly ? undefined : model,
      errors,
      warnings,
      parseTime: performance.now() - startTime
    };
    
    self.postMessage(result);
  } catch (error) {
    const result: ParseResult = {
      id,
      success: false,
      errors: [{
        message: error instanceof Error ? error.message : 'Unknown error',
        severity: 'error'
      }],
      warnings: [],
      parseTime: performance.now() - startTime
    };
    self.postMessage(result);
  }
});

// Generate quick fixes for common errors
function generateQuickFix(error: any, model: DomainModel): QuickFix | undefined {
  // Example: Unknown object type
  if (error.type === 'unknown_object_type') {
    const availableTypes = Array.from(model.objectTypes.keys());
    if (availableTypes.length > 0) {
      // Find closest match using Levenshtein distance
      const closest = findClosestMatch(error.objectType, availableTypes);
      if (closest) {
        return {
          title: `Change to '${closest}'`,
          edits: [{
            span: error.span,
            newText: closest
          }]
        };
      }
    }
  }
  
  // Add more quick fixes as needed
  return undefined;
}

function findClosestMatch(target: string, candidates: string[]): string | null {
  // Simple implementation - in production use proper string distance
  const lower = target.toLowerCase();
  return candidates.find(c => c.toLowerCase().includes(lower)) || null;
}
```

### 3. Parser Service (1 hour)

Create `src/services/parser-service.ts`:

```typescript
import { DomainModel } from '../lib/parser/regelspraak/ast/domain-model';

export interface ParseResult {
  success: boolean;
  model?: DomainModel;
  errors: ParseError[];
  warnings: ParseWarning[];
  parseTime: number;
}

export interface ParseError {
  message: string;
  severity: 'error' | 'warning';
  span?: SourceSpan;
  startLine?: number;
  startColumn?: number;
  endLine?: number;
  endColumn?: number;
}

class ParserService {
  private worker: Worker | null = null;
  private requestId = 0;
  private pendingRequests = new Map<string, {
    resolve: (result: ParseResult) => void;
    reject: (error: Error) => void;
  }>();
  
  constructor() {
    this.initWorker();
  }
  
  private initWorker() {
    this.worker = new Worker(
      new URL('../lib/parser/parser-worker.ts', import.meta.url),
      { type: 'module' }
    );
    
    this.worker.addEventListener('message', (event) => {
      const result = event.data as ParseResult & { id: string };
      const pending = this.pendingRequests.get(result.id);
      if (pending) {
        this.pendingRequests.delete(result.id);
        pending.resolve(result);
      }
    });
    
    this.worker.addEventListener('error', (error) => {
      console.error('Parser worker error:', error);
      // Reject all pending requests
      this.pendingRequests.forEach(pending => {
        pending.reject(new Error('Parser worker crashed'));
      });
      this.pendingRequests.clear();
      // Restart worker
      this.initWorker();
    });
  }
  
  async parse(code: string): Promise<ParseResult> {
    if (!this.worker) {
      throw new Error('Parser worker not initialized');
    }
    
    const id = `parse-${++this.requestId}`;
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.worker!.postMessage({ id, code });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Parse timeout'));
        }
      }, 5000);
    });
  }
  
  async validate(code: string): Promise<ParseResult> {
    if (!this.worker) {
      throw new Error('Parser worker not initialized');
    }
    
    const id = `validate-${++this.requestId}`;
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.worker!.postMessage({ id, code, validateOnly: true });
      
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Validation timeout'));
        }
      }, 3000);
    });
  }
  
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pendingRequests.clear();
  }
}

export const parserService = new ParserService();
```

### 4. Monaco Integration Hook (1 hour)

Create `src/hooks/useMonacoValidation.ts`:

```typescript
import { useEffect, useRef, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { useQuery } from '@tanstack/react-query';
import { parserService } from '../services/parser-service';
import { useDebounce } from './useDebounce';

export function useMonacoValidation(
  editor: monaco.editor.IStandaloneCodeEditor | null,
  code: string
) {
  const decorationsRef = useRef<string[]>([]);
  const debouncedCode = useDebounce(code, 300); // 300ms debounce
  
  // Parse query
  const { data: parseResult } = useQuery({
    queryKey: ['parse', debouncedCode],
    queryFn: () => parserService.validate(debouncedCode),
    enabled: !!debouncedCode && !!editor,
    staleTime: 60000, // Cache for 1 minute
    gcTime: 300000 // Keep in cache for 5 minutes
  });
  
  // Convert parse errors to Monaco markers
  const updateMarkers = useCallback(() => {
    if (!editor || !monaco) return;
    
    const model = editor.getModel();
    if (!model) return;
    
    const markers: monaco.editor.IMarkerData[] = [];
    
    if (parseResult?.errors) {
      parseResult.errors.forEach(error => {
        if (error.span) {
          markers.push({
            severity: error.severity === 'error' 
              ? monaco.MarkerSeverity.Error 
              : monaco.MarkerSeverity.Warning,
            message: error.message,
            startLineNumber: error.span.start.line,
            startColumn: error.span.start.column + 1,
            endLineNumber: error.span.end.line,
            endColumn: error.span.end.column + 1
          });
        }
      });
    }
    
    monaco.editor.setModelMarkers(model, 'regelspraak', markers);
  }, [editor, parseResult]);
  
  // Update decorations for inline errors
  const updateDecorations = useCallback(() => {
    if (!editor || !parseResult) return;
    
    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];
    
    parseResult.errors.forEach(error => {
      if (error.span && error.severity === 'error') {
        newDecorations.push({
          range: new monaco.Range(
            error.span.start.line,
            error.span.start.column + 1,
            error.span.end.line,
            error.span.end.column + 1
          ),
          options: {
            inlineClassName: 'squiggly-error',
            hoverMessage: { value: error.message },
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
          }
        });
      }
    });
    
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [editor, parseResult]);
  
  // Apply markers and decorations
  useEffect(() => {
    updateMarkers();
    updateDecorations();
  }, [updateMarkers, updateDecorations]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor && decorationsRef.current.length > 0) {
        editor.deltaDecorations(decorationsRef.current, []);
      }
    };
  }, [editor]);
  
  return {
    parseResult,
    isValidating: !parseResult && !!debouncedCode
  };
}
```

### 5. Create Debounce Hook (15 min)

Create `src/hooks/useDebounce.ts`:

```typescript
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

### 6. Update Monaco Editor Component (30 min)

Update `src/components/editor/MonacoEditor.tsx`:

```typescript
import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import Editor, { Monaco } from '@monaco-editor/react';
import { registerRegelSpraakLanguage } from '../../lib/monaco/regelspraak-language';
import { registerRegelSpraakTheme } from '../../lib/monaco/regelspraak-theme';
import { useEditorStore } from '../../stores/editor-store';
import { useMonacoValidation } from '../../hooks/useMonacoValidation';

export function MonacoEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { code, setCode } = useEditorStore();
  
  // Real-time validation
  const { parseResult, isValidating } = useMonacoValidation(
    isEditorReady ? editorRef.current : null,
    code
  );
  
  const handleEditorWillMount = (monaco: Monaco) => {
    registerRegelSpraakLanguage();
    registerRegelSpraakTheme();
    
    // Add custom CSS for error decorations
    const style = document.createElement('style');
    style.innerHTML = `
      .squiggly-error {
        text-decoration: underline wavy red;
        text-decoration-skip-ink: none;
      }
    `;
    document.head.appendChild(style);
  };
  
  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      wrappingIndent: 'indent',
      automaticLayout: true
    });
    
    editor.onDidChangeModelContent(() => {
      setCode(editor.getValue());
    });
    
    // Set up code actions provider for quick fixes
    monaco.languages.registerCodeActionProvider('regelspraak', {
      provideCodeActions: (model, range, context, token) => {
        const actions: monaco.languages.CodeAction[] = [];
        
        // Get errors in range
        const markers = monaco.editor.getModelMarkers({ 
          resource: model.uri 
        });
        
        markers.forEach(marker => {
          if (marker.severity === monaco.MarkerSeverity.Error) {
            // Add quick fixes from parse result
            const error = parseResult?.errors.find(e => 
              e.span?.start.line === marker.startLineNumber &&
              e.span?.start.column + 1 === marker.startColumn
            );
            
            if (error?.quickFix) {
              actions.push({
                title: error.quickFix.title,
                kind: 'quickfix',
                edit: {
                  edits: error.quickFix.edits.map(edit => ({
                    resource: model.uri,
                    edit: {
                      range: new monaco.Range(
                        edit.span.start.line,
                        edit.span.start.column + 1,
                        edit.span.end.line,
                        edit.span.end.column + 1
                      ),
                      text: edit.newText
                    }
                  }))
                },
                diagnostics: [marker]
              });
            }
          }
        });
        
        return { actions, dispose: () => {} };
      }
    });
  };
  
  return (
    <div className="h-full w-full relative">
      <Editor
        height="100%"
        defaultLanguage="regelspraak"
        defaultValue={code}
        theme="regelspraak-theme"
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: 'Fira Code, monospace',
          lineNumbers: 'on',
          rulers: [80],
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true
          }
        }}
      />
      {isValidating && (
        <div className="absolute top-2 right-2 text-xs text-gray-500">
          Validating...
        </div>
      )}
    </div>
  );
}
```

### 7. AST Explorer Panel (45 min)

Create `src/components/panels/ASTExplorer.tsx`:

```typescript
import { useMemo } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { DomainModel } from '../../lib/parser/regelspraak/ast/domain-model';
import { useState } from 'react';

interface ASTExplorerProps {
  model: DomainModel | null;
}

interface TreeNodeProps {
  label: string;
  value?: any;
  children?: Record<string, any>;
  defaultExpanded?: boolean;
}

function TreeNode({ label, value, children, defaultExpanded = false }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = children && Object.keys(children).length > 0;
  
  return (
    <div className="select-none">
      <div 
        className="flex items-center py-1 hover:bg-gray-100 cursor-pointer"
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <span className="w-4">
          {hasChildren && (
            isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />
          )}
        </span>
        <span className="font-mono text-sm">
          <span className="text-blue-600">{label}</span>
          {value !== undefined && (
            <>
              <span className="text-gray-500">: </span>
              <span className="text-green-600">
                {typeof value === 'string' ? `"${value}"` : String(value)}
              </span>
            </>
          )}
        </span>
      </div>
      {isExpanded && children && (
        <div className="ml-4 border-l border-gray-200">
          {Object.entries(children).map(([key, val]) => (
            <div key={key} className="ml-2">
              {typeof val === 'object' && val !== null ? (
                <TreeNode label={key} children={val} />
              ) : (
                <TreeNode label={key} value={val} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ASTExplorer({ model }: ASTExplorerProps) {
  const astTree = useMemo(() => {
    if (!model) return null;
    
    return {
      objectTypes: Object.fromEntries(model.objectTypes),
      parameters: Object.fromEntries(model.parameters),
      rules: model.rules.map(r => ({
        name: r.name,
        condition: r.condition,
        isValid: r.isValid
      })),
      domains: Object.fromEntries(model.domains || new Map()),
      unitSystems: model.unitSystems || []
    };
  }, [model]);
  
  if (!model) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        No valid AST available
      </div>
    );
  }
  
  return (
    <div className="p-2 overflow-auto h-full">
      <h3 className="font-semibold mb-2">Abstract Syntax Tree</h3>
      <TreeNode label="DomainModel" children={astTree} defaultExpanded />
    </div>
  );
}
```

### 8. Update App Layout (30 min)

Update `src/components/layout/AppLayout.tsx` to include AST panel:

```typescript
import { ReactNode, useState } from 'react';
import { useEditorStore } from '../../stores/editor-store';
import { ASTExplorer } from '../panels/ASTExplorer';
import { useQuery } from '@tanstack/react-query';
import { parserService } from '../../services/parser-service';
import { useDebounce } from '../../hooks/useDebounce';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { fileName, isDirty, code } = useEditorStore();
  const [showAST, setShowAST] = useState(true);
  const debouncedCode = useDebounce(code, 500);
  
  // Get full parse result for AST
  const { data: parseResult } = useQuery({
    queryKey: ['parse-full', debouncedCode],
    queryFn: () => parserService.parse(debouncedCode),
    enabled: !!debouncedCode
  });
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">
              RegelSpraak Editor
            </h1>
            <span className="text-sm text-gray-600">
              {fileName} {isDirty && '*'}
            </span>
            {parseResult && (
              <span className="text-xs text-gray-500">
                Parsed in {parseResult.parseTime.toFixed(0)}ms
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowAST(!showAST)}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              {showAST ? 'Hide' : 'Show'} AST
            </button>
            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Run
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          {children}
        </div>
        {showAST && (
          <div className="w-96 bg-white border-l border-gray-200">
            <ASTExplorer model={parseResult?.model || null} />
          </div>
        )}
      </main>
    </div>
  );
}
```

## Testing & Verification

1. Test with valid RegelSpraak code:
   ```regelspraak
   Objecttype de Persoon
       de naam Tekst;
       de leeftijd Numeriek (geheel getal) met eenheid jr;
   
   Parameter de pensioenleeftijd : Numeriek (geheel getal) met eenheid jr;
   
   Regel Pensioencheck
       geldig altijd
           Een Persoon is met pensioen
           indien zijn leeftijd groter of gelijk is aan de pensioenleeftijd.
   ```

2. Test error detection with invalid code:
   ```regelspraak
   Objecttype de Persoon
       de naam Tekst;
       de leeftijd; // Missing type - should show error
   
   Regel Test
       geldig altijd
           Een OnbekendType is actief // Unknown object type
           indien zijn onbekendAttribuut groter is dan 10. // Unknown attribute
   ```

3. Verify:
   - Errors appear as red squiggles in editor
   - Error markers in scrollbar
   - Hover shows error messages
   - AST Explorer shows parsed structure
   - Parse time is displayed
   - No performance issues with 1000+ line files

## Performance Considerations

1. **Debouncing**: 300ms for validation, 500ms for full parse
2. **Web Worker**: Parsing happens off main thread
3. **Caching**: Parse results cached for 1 minute
4. **Incremental parsing**: Future enhancement for Session 3

## Next Session Preview

Session 3 will implement the guided mode UI:
- Form-based rule builder
- Template selection
- Live code preview
- Contextual help system