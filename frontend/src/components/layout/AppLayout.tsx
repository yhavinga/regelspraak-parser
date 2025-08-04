import { ReactNode, useState } from 'react';
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
  const { fileName, isDirty, code, currentExampleId, setCode, setCurrentExample, loadExample } = useEditorStore();
  const [showAST, setShowAST] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
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
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">
              RegelSpraak Editor
            </h1>
            <span className="text-xs text-gray-400 ml-2">
              v{import.meta.env.DEV ? 'dev-' + Date.now() : '1.0.0'}
            </span>
            <span className="text-sm text-gray-600">
              {fileName} {isDirty && '*'}
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
              <option value="">Load example...</option>
              {Object.entries(codeExamples).map(([id, example]) => (
                <option key={id} value={id}>{example.name}</option>
              ))}
            </select>
            {parseResult && (
              <>
                <span className="text-xs text-gray-500">
                  Parsed in {parseResult.parseTime.toFixed(0)}ms
                </span>
                <span className="text-xs text-gray-500">
                  | {parseResult.success ? '✓ Success' : '✗ Failed'} 
                  | {parseResult.errors.length} errors
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowAST(!showAST)}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              {showAST ? 'Hide' : 'Show'} AST
            </button>
            <button 
              onClick={() => setShowTest(!showTest)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showTest ? 'Hide Test' : 'Run'}
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
    </div>
  );
}