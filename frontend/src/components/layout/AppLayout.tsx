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

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { fileName, isDirty, code } = useEditorStore();
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
    // Allow execution even if there are semantic errors, as long as we have a model
    if (!parseResult?.model) {
      setExecutionResult({
        success: false,
        output: null,
        errors: ['Cannot execute: no valid parse model'],
        executionTime: 0
      });
      return;
    }
    
    setIsExecuting(true);
    try {
      const result = await executionService.execute(parseResult.model, testData);
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