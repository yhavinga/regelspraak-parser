import { ReactNode, useState, useEffect, RefObject } from 'react';
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
import { MonacoEditorHandle } from '../editor/MonacoEditor';
import { QuickFix } from '../../services/error-formatter';
import { fileService, RegelSpraakFile, FileTemplate } from '../../services/file-service';
import { FileBrowser } from '../FileBrowser';
import { TemplatePicker } from '../TemplatePicker';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

// Recent files dropdown component
const RecentFilesDropdown = ({ onSelectFile }: { onSelectFile: (file: RegelSpraakFile) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentFiles, setRecentFiles] = useState<RegelSpraakFile[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      setRecentFiles(fileService.getRecentFiles());
    }
  }, [isOpen]);
  
  if (recentFiles.length === 0) return null;
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center space-x-1"
      >
        <span>Recent</span>
        <ChevronDownIcon className="w-3 h-3" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-10">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2">Recent bestanden</div>
            {recentFiles.map(file => (
              <button
                key={file.id}
                onClick={() => {
                  onSelectFile(file);
                  setIsOpen(false);
                }}
                className="w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                <div className="font-medium text-sm">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(file.modified, { addSuffix: true, locale: nl })}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface AppLayoutProps {
  children: ReactNode;
  editorRef: RefObject<MonacoEditorHandle>;
}

export function AppLayout({ children, editorRef }: AppLayoutProps) {
  const { fileName, isDirty, code, currentExampleId, setCode, setCurrentExample, loadExample, setFileName, markClean } = useEditorStore();
  const [showAST, setShowAST] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentFile, setCurrentFile] = useState<RegelSpraakFile | null>(null);
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [testData, setTestData] = useState('{}');
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
      setCurrentFile(null);
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
    setCurrentFile(null);
    setTestData('{}');
    markClean();
  };
  
  const saveFile = () => {
    if (!currentFile) {
      const name = prompt('Bestandsnaam:');
      if (!name) return;
      
      const file = fileService.saveFile({
        name,
        content: code,
        testData: testData !== '{}' ? testData : undefined
      });
      setCurrentFile(file);
      setFileName(file.name);
    } else {
      const updated = fileService.saveFile({
        ...currentFile,
        content: code,
        testData: testData !== '{}' ? testData : undefined
      });
      setCurrentFile(updated);
    }
    markClean();
  };
  
  const loadFile = (file: RegelSpraakFile) => {
    setCurrentFile(file);
    setCode(file.content);
    setFileName(file.name);
    setTestData(file.testData || '{}');
    setCurrentExample(null);
    markClean();
    setShowFileBrowser(false);
  };
  
  const loadTemplate = (template: FileTemplate) => {
    setCode(template.content);
    setTestData(template.testData || '{}');
    setCurrentFile(null);
    setFileName('untitled.rs');
    setCurrentExample(null);
    markClean();
    setShowTemplatePicker(false);
  };
  
  const exportFile = () => {
    if (currentFile) {
      fileService.exportFile(currentFile);
    } else {
      const tempFile: RegelSpraakFile = {
        id: 'temp',
        name: fileName,
        content: code,
        testData: testData !== '{}' ? testData : undefined,
        created: new Date(),
        modified: new Date()
      };
      fileService.exportFile(tempFile);
    }
  };
  
  const importFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.rs,.regelspraak,.txt,.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const imported = await fileService.importFile(file);
          loadFile(imported);
        } catch (error: any) {
          alert('Fout bij importeren: ' + error.message);
        }
      }
    };
    
    input.click();
  };
  
  
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        setShowFileBrowser(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [code, fileName, isDirty, currentFile, testData]);
  
  // Error handling functions
  const handleJumpToError = (line: number) => {
    editorRef.current?.jumpToLine(line);
  };
  
  const handleApplyFix = (fix: QuickFix) => {
    if (!editorRef.current) return;
    
    if (fix.edit.text && fix.edit.column) {
      // Insert text at specific position
      editorRef.current.jumpToLine(fix.edit.line);
      setTimeout(() => {
        editorRef.current?.insertText(fix.edit.text!);
      }, 100);
    } else if (fix.edit.find && fix.edit.replace) {
      // Replace text on line
      editorRef.current.replaceTextAtLine(fix.edit.line, fix.edit.find, fix.edit.replace);
    }
  };
  
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
                onClick={() => setShowTemplatePicker(true)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Template
              </button>
              <button 
                onClick={() => setShowFileBrowser(true)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                title="Open bestand (⌘O)"
              >
                Open
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
              <RecentFilesDropdown onSelectFile={loadFile} />
            </div>
            
            <div className="flex items-center space-x-3 border-l pl-4">
              <span className="text-sm text-gray-600 font-medium">
                {currentFile ? currentFile.name : fileName} {isDirty && <span className="text-orange-500">●</span>}
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
                testData={testData}
                onTestDataChange={setTestData}
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
              <ErrorPanel 
                errors={parseResult.errors} 
                onJumpToError={handleJumpToError}
                onApplyFix={handleApplyFix}
              />
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
            <kbd className="text-xs bg-gray-200 px-2 py-0.5 rounded">⌘O open</kbd>
          </div>
        </div>
      </footer>
      
      {/* Modals */}
      {showFileBrowser && (
        <FileBrowser
          onSelectFile={loadFile}
          onClose={() => setShowFileBrowser(false)}
        />
      )}
      
      {showTemplatePicker && (
        <TemplatePicker
          onSelectTemplate={loadTemplate}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}
    </div>
  );
}