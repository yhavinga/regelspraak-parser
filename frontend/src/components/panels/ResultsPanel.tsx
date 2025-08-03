interface ExecutionResult {
  success: boolean;
  output: any;
  errors: string[];
  executionTime: number;
}

interface ResultsPanelProps {
  result: ExecutionResult | null;
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  if (!result) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50">
        <div className="text-center">
          <p className="text-sm">Click "Execute" to run the rules</p>
          <p className="text-xs mt-1 text-gray-400">Results will appear here</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-700">Results</h3>
          <span className="text-sm text-gray-600">
            {result.executionTime.toFixed(1)}ms
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {result.success ? (
          <pre className="font-mono text-sm whitespace-pre-wrap">
            {JSON.stringify(result.output, null, 2)}
          </pre>
        ) : (
          <div className="text-red-600">
            <div className="font-medium mb-2">Execution failed:</div>
            {result.errors.map((error, i) => (
              <div key={i} className="text-sm mb-1">{error}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export type { ExecutionResult };