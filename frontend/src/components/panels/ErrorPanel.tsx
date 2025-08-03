import { ParseError } from '../../services/real-parser-service';

interface ErrorPanelProps {
  errors: ParseError[];
  onErrorClick?: (error: ParseError) => void;
}

export function ErrorPanel({ errors, onErrorClick }: ErrorPanelProps) {
  if (errors.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        No errors - code is valid! ✓
      </div>
    );
  }

  return (
    <div className="p-2 overflow-auto h-full">
      <h3 className="font-semibold mb-2 text-red-600">
        Errors ({errors.length})
      </h3>
      <div className="space-y-2">
        {errors.map((error, index) => (
          <div
            key={index}
            className="p-2 bg-red-50 border border-red-200 rounded text-sm cursor-pointer hover:bg-red-100"
            onClick={() => onErrorClick?.(error)}
          >
            <div className="font-mono text-red-700">
              {error.message}
            </div>
            {error.span && (
              <div className="text-xs text-red-600 mt-1">
                Line {error.span.start.line}, Column {error.span.start.column}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}