import { useState } from 'react';
import { ParseError } from '../../services/real-parser-service';
import { formatError, getDetailedErrorExplanation, getSuggestedFix, getErrorContext, QuickFix } from '../../services/error-formatter';
import { useEditorStore } from '../../stores/editor-store';
import { CheckIcon, Cross2Icon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';

interface ErrorPanelProps {
  errors: ParseError[];
  onJumpToError: (line: number) => void;
  onApplyFix: (fix: QuickFix) => void;
}

export function ErrorPanel({ errors, onJumpToError, onApplyFix }: ErrorPanelProps) {
  const code = useEditorStore(state => state.code);
  const [expandedError, setExpandedError] = useState<number | null>(null);
  
  if (errors.length === 0) {
    return (
      <div className="p-4 text-center">
        <CheckIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-green-600 font-medium">Geen fouten gevonden!</p>
        <p className="text-sm text-gray-500 mt-1">Je code is syntactisch correct</p>
      </div>
    );
  }

  return (
    <div className="p-2 overflow-auto h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-red-600">
          {errors.length} {errors.length === 1 ? 'Fout' : 'Fouten'}
        </h3>
        {expandedError !== null && (
          <button
            onClick={() => setExpandedError(null)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Alles inklappen
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {errors.map((error, index) => {
          const formatted = formatError(error.message);
          const explanation = getDetailedErrorExplanation(error.message);
          const quickFix = error.span ? getSuggestedFix(error.message, code, error.span.start.line) : null;
          const isExpanded = expandedError === index;
          
          return (
            <div 
              key={index}
              className="bg-red-50 rounded-lg overflow-hidden"
            >
              {/* Error header */}
              <div 
                className="p-3 cursor-pointer hover:bg-red-100"
                onClick={() => error.span && onJumpToError(error.span.start.line)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Cross2Icon className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-red-700">
                        {error.span ? `Regel ${error.span.start.line}: ` : ''}{formatted.message}
                      </span>
                    </div>
                    
                    {/* Code preview */}
                    {error.span && (
                      <pre className="text-xs mt-2 p-2 bg-white rounded border border-red-200 overflow-x-auto font-mono">
                        <code>{getErrorContext(code, error.span.start.line, error.span.start.column)}</code>
                      </pre>
                    )}
                  </div>
                  
                  {explanation && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedError(isExpanded ? null : index);
                      }}
                      className="ml-2 p-1 hover:bg-red-200 rounded"
                      title="Meer informatie"
                    >
                      <QuestionMarkCircledIcon className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
                
                {/* Quick suggestion */}
                {formatted.suggestion && !isExpanded && (
                  <div className="text-xs mt-2 text-blue-600 flex items-start">
                    <span className="mr-1">💡</span>
                    <span>{formatted.suggestion}</span>
                  </div>
                )}
                
                {/* Quick fix button */}
                {quickFix && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplyFix(quickFix);
                    }}
                    className="mt-2 flex items-center space-x-1 px-3 py-1 bg-blue-500 
                               text-white text-xs rounded hover:bg-blue-600 transition-colors"
                  >
                    <CheckIcon className="w-3 h-3" />
                    <span>{quickFix.description}</span>
                  </button>
                )}
              </div>
              
              {/* Expanded explanation */}
              {isExpanded && explanation && (
                <div className="p-4 bg-white border-t border-red-200">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Wat is er fout?
                      </h4>
                      <p className="text-sm text-gray-600">{explanation.what}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Waarom is dit fout?
                      </h4>
                      <p className="text-sm text-gray-600">{explanation.why}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Hoe los je het op?
                      </h4>
                      <p className="text-sm text-gray-600">{explanation.how}</p>
                    </div>
                    
                    {explanation.example && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          Voorbeeld:
                        </h4>
                        <pre className="text-xs p-2 bg-gray-100 rounded font-mono">
                          <code>{explanation.example}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}