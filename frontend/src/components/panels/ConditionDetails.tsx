import { ConditionEvaluation } from '../../services/execution-service';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';

interface ConditionDetailsProps {
  evaluations: ConditionEvaluation[];
  ruleName?: string;
}

export function ConditionDetails({ evaluations, ruleName }: ConditionDetailsProps) {
  const filteredEvaluations = ruleName 
    ? evaluations.filter(e => e.ruleName === ruleName)
    : evaluations;
  
  if (filteredEvaluations.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-4 text-center">
        Geen voorwaarden geëvalueerd
      </div>
    );
  }
  
  return (
    <div className="space-y-2 p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Voorwaarde evaluaties
      </h4>
      {filteredEvaluations.map((evaluation, index) => (
        <div 
          key={index}
          className={`p-3 rounded border ${
            evaluation.result 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-start space-x-2">
            {evaluation.result ? (
              <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircleIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            
            <div className="flex-1">
              <div className="text-sm font-medium">
                {evaluation.conditionText}
              </div>
              
              {evaluation.evaluatedValue !== undefined && (
                <div className="text-xs text-gray-600 mt-1">
                  Geëvalueerde waarde: <span className="font-mono">
                    {formatValue(evaluation.evaluatedValue)}
                  </span>
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-1">
                Regel: {evaluation.ruleName}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return 'leeg';
  if (typeof value === 'boolean') return value ? 'waar' : 'onwaar';
  if (typeof value === 'object' && value.value !== undefined) {
    return `${value.value}${value.unit ? ' ' + value.unit : ''}`;
  }
  return String(value);
}