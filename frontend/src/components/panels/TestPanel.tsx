import { useState } from 'react';
import { PlayIcon } from 'lucide-react';
import { exampleTemplates } from '../../data/examples';
import { useEditorStore } from '../../stores/editor-store';

interface TestPanelProps {
  onExecute: (testData: any) => void;
  isExecuting?: boolean;
}

export function TestPanel({ onExecute, isExecuting }: TestPanelProps) {
  const { setCode } = useEditorStore();
  const [jsonText, setJsonText] = useState(
    JSON.stringify({
      persoon: {
        naam: "Jan Jansen",
        leeftijd: 25
      },
      pensioenleeftijd: 65
    }, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  const handleJsonChange = (value: string) => {
    setJsonText(value);
    
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
  
  const loadExample = (exampleKey: string) => {
    const example = exampleTemplates[exampleKey as keyof typeof exampleTemplates];
    if (example) {
      setCode(example.code);
      setJsonText(JSON.stringify(example.testData, null, 2));
      setJsonError(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-3">
          <h3 className="font-medium text-gray-700">Test Data (JSON)</h3>
          <select 
            onChange={(e) => {
              if (e.target.value) {
                loadExample(e.target.value);
              }
            }}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="">Load example...</option>
            <option value="basic">Basic Age Rule</option>
            <option value="pensioen">Pension Check</option>
            <option value="discount">Discount Rule</option>
          </select>
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