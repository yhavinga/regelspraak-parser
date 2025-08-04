import { ReactNode, useState, useEffect } from 'react';
import { useEditorStore } from '../../stores/editor-store';
import { ASTExplorer } from '../panels/ASTExplorer';
import { ErrorPanel } from '../panels/ErrorPanel';
import { TestPanel } from '../panels/TestPanel';
import { ResultsPanel, ExecutionResult } from '../panels/ResultsPanel';
import { useQuery } from '@tanstack/react-query';
import { parserService } from '../../services/real-parser-service';
import { executionService } from '../../services/execution-service';
import { useDebounce } from '../../hooks/useDebounce';
import { codeExamples } from '../../data/examples';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { fileName, isDirty, code, currentExampleId, setCode, setCurrentExample, loadExample, setFileName, markClean } = useEditorStore();
  const [showAST, setShowAST] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [recentFiles, setRecentFiles] = useState<Array<{name: string, timestamp: number}>>([]);
  const debouncedCode = useDebounce(code, 500);
  
  // Get full parse result for AST
  const { data: parseResult } = useQuery({
    queryKey: ['parse-full', debouncedCode],
    queryFn: () => parserService.parse(debouncedCode),
    enabled: !!debouncedCode
  });
  
  const handleExecute = async (testData: any) => {
    // Force a fresh parse to ensure we're executing the current code
    setIsExecuting(true);
    try {
      console.log('handleExecute - code being parsed:', code);
      console.log('handleExecute - code length:', code.length);
      console.log('handleExecute - code lines:', code.split('\n').length);
      
      const freshParseResult = await parserService.parse(code);
      
      if (!freshParseResult.model) {
        const errorMsg = freshParseResult.errors.length > 0 
          ? `Cannot execute: parse errors - ${freshParseResult.errors[0].message}`
          : 'Cannot execute: no model generated from parse';
        console.log('handleExecute - parse error:', errorMsg);
        console.log('handleExecute - full errors:', freshParseResult.errors);
        setExecutionResult({
          success: false,
          output: null,
          errors: [errorMsg],
          executionTime: 0
        });
        return;
      }
      
      console.log('handleExecute - parse successful, executing with model:', freshParseResult.model);
      // Execute with the fresh parse result
      const result = await executionService.execute(freshParseResult.model, testData);
      setExecutionResult(result);
    } catch (error: any) {
      setExecutionResult({
        success: false,
        output: null,
        errors: [error.message || 'Execution failed'],
        executionTime: 0
      });
    } finally {
      setIsExecuting(false);
    }
  };
  
  const handleLoadExample = (exampleId: string) => {
    const example = codeExamples[exampleId as keyof typeof codeExamples];
    if (example) {
      loadExample(example.code, exampleId);
    }
  };
  
  // File management functions
  const newFile = () => {
    if (isDirty && !confirm('Huidige wijzigingen gaan verloren. Doorgaan?')) {
      return;
    }
    setCode('');
    setFileName('untitled.rs');
    setCurrentExample(null);
    markClean();
  };
  
  const saveFile = () => {
    const key = `regelspraak-file-${fileName}`;
    const fileData = {
      name: fileName,
      code,
      timestamp: Date.now()
    };
    
    localStorage.setItem(key, JSON.stringify(fileData));
    
    // Update recent files
    const recent = [...recentFiles.filter(f => f.name !== fileName), fileData].slice(0, 10);
    setRecentFiles(recent);
    localStorage.setItem('regelspraak-recent-files', JSON.stringify(recent));
    
    markClean();
  };
  
  const loadFile = (name: string) => {
    const key = `regelspraak-file-${name}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const fileData = JSON.parse(saved);
      setCode(fileData.code);
      setFileName(fileData.name);
      setCurrentExample(null);
      markClean();
    }
  };
  
  const exportFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.rs') ? fileName : `${fileName}.rs`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const importFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.rs,.regelspraak,.txt';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCode(content);
          setFileName(file.name);
          setCurrentExample(null);
          markClean();
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  };
  
  // Load recent files on mount
  useEffect(() => {
    const saved = localStorage.getItem('regelspraak-recent-files');
    if (saved) {
      setRecentFiles(JSON.parse(saved));
    }
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        newFile();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [code, fileName, isDirty]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">
              RegelSpraak Editor
            </h1>
            <div className="flex items-center space-x-2 border-l pl-4">
              <button 
                onClick={newFile}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                title="Nieuw bestand (⌘N)"
              >
                Nieuw
              </button>
              <button 
                onClick={saveFile}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                title="Opslaan (⌘S)"
              >
                Opslaan
              </button>
              <button 
                onClick={importFile}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Importeer
              </button>
              <button 
                onClick={exportFile}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Exporteer
              </button>
              
              {/* Recent files dropdown */}
              {recentFiles.length > 0 && (
                <select 
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      loadFile(e.target.value);
                    }
                  }}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="">Recent bestanden...</option>
                  {recentFiles.map(file => (
                    <option key={file.name} value={file.name}>
                      {file.name} ({new Date(file.timestamp).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="flex items-center space-x-3 border-l pl-4">
              <span className="text-sm text-gray-600 font-medium">
                {fileName} {isDirty && <span className="text-orange-500">●</span>}
              </span>
              <select 
                value={currentExampleId || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleLoadExample(e.target.value);
                  }
                }}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="">Voorbeelden...</option>
                {Object.entries(codeExamples).map(([id, example]) => (
                  <option key={id} value={id}>{example.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowAST(!showAST)}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              {showAST ? 'Verberg' : 'Toon'} AST
            </button>
            <button 
              onClick={() => setShowTest(!showTest)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {showTest ? 'Verberg Test' : 'Test'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        <div className={showTest ? "w-1/2" : "flex-1"}>
          {children}
        </div>
        
        {/* Test Panel */}
        {showTest && (
          <div className="w-1/2 flex flex-col border-l border-gray-200">
            <div className="h-1/2 border-b">
              <TestPanel 
                onExecute={handleExecute}
                isExecuting={isExecuting}
              />
            </div>
            <div className="h-1/2">
              <ResultsPanel result={executionResult} />
            </div>
          </div>
        )}
        
        {/* AST Panel */}
        {showAST && !showTest && (
          <div className="w-96 bg-white border-l border-gray-200">
            {parseResult?.errors && parseResult.errors.length > 0 ? (
              <ErrorPanel errors={parseResult.errors} />
            ) : (
              <ASTExplorer model={parseResult?.model || null} />
            )}
          </div>
        )}
      </main>
      
      {/* Status bar */}
      <footer className="bg-gray-100 border-t border-gray-200 px-4 py-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              {parseResult?.success ? (
                <span className="text-green-600">✓ Geldig</span>
              ) : parseResult ? (
                <span className="text-red-600">✗ {parseResult.errors.length} fouten</span>
              ) : (
                <span className="text-gray-500">Parsing...</span>
              )}
            </span>
            <span>{code.split('\n').length} regels</span>
            {parseResult && (
              <span>Parse tijd: {parseResult.parseTime.toFixed(0)}ms</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {executionResult && (
              <span>
                Laatste uitvoering: {executionResult.executionTime.toFixed(1)}ms
              </span>
            )}
            <kbd className="text-xs bg-gray-200 px-2 py-0.5 rounded">⌘S opslaan</kbd>
            <kbd className="text-xs bg-gray-200 px-2 py-0.5 rounded">⌘N nieuw</kbd>
          </div>
        </div>
      </footer>
    </div>
  );
}