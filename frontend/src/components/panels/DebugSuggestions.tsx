import { DebugSuggestion } from '../../services/debug-helpers';
import { LightbulbIcon, WrenchIcon } from 'lucide-react';

interface DebugSuggestionsProps {
  suggestions: DebugSuggestion[];
  onApplySuggestion?: (suggestion: DebugSuggestion) => void;
}

export function DebugSuggestions({ 
  suggestions, 
  onApplySuggestion 
}: DebugSuggestionsProps) {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <LightbulbIcon className="w-4 h-4 text-blue-600" />
        <h4 className="text-sm font-medium text-blue-900">
          Debug suggesties
        </h4>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-2 bg-white rounded"
          >
            <div className="flex-1 text-sm text-gray-700">
              {suggestion.description}
            </div>
            
            {suggestion.action && onApplySuggestion && (
              <button
                onClick={() => onApplySuggestion(suggestion)}
                className="ml-2 p-1 text-blue-600 hover:bg-blue-100 rounded"
                title="Pas toe"
              >
                <WrenchIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}