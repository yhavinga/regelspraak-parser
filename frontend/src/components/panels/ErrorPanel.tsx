import { ParseError } from '../../services/real-parser-service';
import { formatError } from '../../services/error-formatter';
import { useEditorStore } from '../../stores/editor-store';

interface ErrorPanelProps {
  errors: ParseError[];
  onErrorClick?: (error: ParseError) => void;
}

export function ErrorPanel({ errors, onErrorClick }: ErrorPanelProps) {
  const code = useEditorStore(state => state.code);
  
  if (errors.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        ✓ Geen fouten gevonden
      </div>
    );
  }

  return (
    <div className="p-2 overflow-auto h-full">
      <h3 className="font-semibold mb-2 text-red-600">
        {errors.length} {errors.length === 1 ? 'fout' : 'fouten'} gevonden:
      </h3>
      <div className="space-y-2">
        {errors.map((error, index) => {
          const formatted = formatError(error.message);
          
          return (
            <div
              key={index}
              className="p-3 bg-red-50 border border-red-200 rounded cursor-pointer hover:bg-red-100 transition-colors"
              onClick={() => onErrorClick?.(error)}
            >
              <div className="text-sm font-medium text-red-700">
                {formatted.message}
              </div>
              
              {error.span && (
                <div className="text-xs text-red-600 mt-1 font-mono">
                  Regel {error.span.start.line}, kolom {error.span.start.column}
                </div>
              )}
              
              {formatted.suggestion && (
                <div className="text-xs mt-2 text-blue-600 flex items-start">
                  <span className="mr-1">💡</span>
                  <span>{formatted.suggestion}</span>
                </div>
              )}
              
              {formatted.example && (
                <pre className="text-xs mt-2 p-2 bg-gray-100 rounded font-mono overflow-x-auto">
                  {formatted.example}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}