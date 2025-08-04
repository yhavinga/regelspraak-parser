import { useState, useEffect } from 'react';
import { PlayIcon } from 'lucide-react';
import { testDataExamples } from '../../data/examples';
import { useEditorStore } from '../../stores/editor-store';

interface TestPanelProps {
  onExecute: (testData: any) => void;
  isExecuting?: boolean;
  testData?: string;
  onTestDataChange?: (data: string) => void;
}

export function TestPanel({ onExecute, isExecuting, testData, onTestDataChange }: TestPanelProps) {
  const { currentExampleId } = useEditorStore();
  const [jsonText, setJsonText] = useState(
    testData || JSON.stringify({
      "info": "Select a test data example or enter your own JSON"
    }, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  const handleJsonChange = (value: string) => {
    setJsonText(value);
    onTestDataChange?.(value);
    
    // Validate JSON
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };
  
  const handleExecute = () => {
    try {
      const testData = JSON.parse(jsonText);
      onExecute(testData);
    } catch (e) {
      setJsonError('Invalid JSON');
    }
  };
  
  const loadTestData = (exampleIndex: number) => {
    if (currentExampleId && testDataExamples[currentExampleId as keyof typeof testDataExamples]) {
      const testData = testDataExamples[currentExampleId as keyof typeof testDataExamples][exampleIndex];
      if (testData) {
        setJsonText(JSON.stringify(testData.data, null, 2));
        setJsonError(null);
      }
    }
  };
  
  // Get available test data for current example
  const availableTestData = currentExampleId && testDataExamples[currentExampleId as keyof typeof testDataExamples] 
    ? testDataExamples[currentExampleId as keyof typeof testDataExamples] 
    : [];
  
  // Update when testData prop changes
  useEffect(() => {
    if (testData && testData !== '{}') {
      setJsonText(testData);
      setJsonError(null);
    }
  }, [testData]);
  
  // Clear test data when example changes
  useEffect(() => {
    if (currentExampleId && availableTestData.length > 0) {
      // Automatically load the first test data for the new example
      loadTestData(0);
    } else if (!testData || testData === '{}') {
      // Reset to empty state only if no testData provided
      setJsonText(JSON.stringify({
        "info": "Select a test data example or enter your own JSON"
      }, null, 2));
      setJsonError(null);
    }
  }, [currentExampleId]);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-3">
          <h3 className="font-medium text-gray-700">Test Data (JSON)</h3>
          {availableTestData.length > 0 ? (
            <select 
              onChange={(e) => {
                const index = parseInt(e.target.value);
                if (!isNaN(index)) {
                  loadTestData(index);
                }
              }}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="">Select test data...</option>
              {availableTestData.map((testData, index) => (
                <option key={index} value={index}>{testData.name}</option>
              ))}
            </select>
          ) : (
            <span className="text-sm text-gray-500">
              {currentExampleId ? 'No test data for this example' : 'Load an example first'}
            </span>
          )}
        </div>
        <button
          onClick={handleExecute}
          disabled={!!jsonError || isExecuting}
          className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white 
                     rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors text-sm"
        >
          <PlayIcon className="w-4 h-4" />
          <span>{isExecuting ? 'Running...' : 'Execute'}</span>
        </button>
      </div>
      
      <div className="flex-1 relative">
        <textarea
          value={jsonText}
          onChange={(e) => handleJsonChange(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
          placeholder="Enter test data as JSON..."
          spellCheck={false}
        />
        
        {jsonError && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-red-50 
                          text-red-600 text-sm border-t border-red-200">
            JSON Error: {jsonError}
          </div>
        )}
      </div>
    </div>
  );
}