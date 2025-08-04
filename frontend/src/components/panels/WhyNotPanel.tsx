import { useState } from 'react';
import { ExecutionTrace, SkippedRule, FailedCondition } from '../../services/execution-service';
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

interface WhyNotPanelProps {
  trace: ExecutionTrace | null;
  onJumpToRule?: (ruleName: string) => void;
}

export function WhyNotPanel({ trace, onJumpToRule }: WhyNotPanelProps) {
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  
  if (!trace) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <InfoIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Voer eerst regels uit om te zien waarom sommige niet zijn uitgevoerd</p>
        </div>
      </div>
    );
  }
  
  const toggleRule = (ruleName: string) => {
    setExpandedRule(expandedRule === ruleName ? null : ruleName);
  };
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b">
        <h3 className="font-medium text-gray-700">Analyse: Waarom niet?</h3>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {/* Summary */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>{trace.executedRules.length} uitgevoerd</span>
            </span>
            <span className="flex items-center space-x-1">
              <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />
              <span>{trace.skippedRules.length} overgeslagen</span>
            </span>
            <span className="text-gray-500">
              {trace.duration.toFixed(1)}ms
            </span>
          </div>
        </div>
        
        {/* Executed Rules */}
        {trace.executedRules.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-green-700 mb-2">
              Uitgevoerde regels
            </h4>
            <div className="space-y-1">
              {trace.executedRules.map(ruleName => (
                <div 
                  key={ruleName}
                  className="flex items-center space-x-2 p-2 bg-green-50 rounded text-sm"
                >
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{ruleName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skipped Rules */}
        {trace.skippedRules.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-yellow-700 mb-2">
              Overgeslagen regels
            </h4>
            <div className="space-y-2">
              {trace.skippedRules.map(skipped => (
                <SkippedRuleCard
                  key={skipped.ruleName}
                  skipped={skipped}
                  isExpanded={expandedRule === skipped.ruleName}
                  onToggle={() => toggleRule(skipped.ruleName)}
                  onJumpToRule={onJumpToRule}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* No rules message */}
        {trace.executedRules.length === 0 && trace.skippedRules.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <InfoIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Geen regels gevonden in het model</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SkippedRuleCard({ 
  skipped, 
  isExpanded, 
  onToggle,
  onJumpToRule 
}: {
  skipped: SkippedRule;
  isExpanded: boolean;
  onToggle: () => void;
  onJumpToRule?: (ruleName: string) => void;
}) {
  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'invalid-scope':
        return 'Niet van toepassing op dit objecttype';
      case 'condition-failed':
        return 'Voorwaarde(n) niet voldaan';
      case 'not-applicable':
        return 'Niet van toepassing in deze context';
      default:
        return reason;
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="p-3 bg-yellow-50 cursor-pointer hover:bg-yellow-100 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              )}
              <AlertTriangleIcon className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <span className="font-medium text-sm">{skipped.ruleName}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1 ml-8">
              {getReasonText(skipped.reason)}
            </p>
          </div>
          
          {onJumpToRule && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onJumpToRule(skipped.ruleName);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 hover:bg-blue-50 rounded"
            >
              Ga naar regel →
            </button>
          )}
        </div>
      </div>
      
      {isExpanded && skipped.failedConditions.length > 0 && (
        <div className="p-3 bg-white border-t">
          <h5 className="text-xs font-medium text-gray-700 mb-2">
            Mislukte voorwaarden:
          </h5>
          <div className="space-y-2">
            {skipped.failedConditions.map((condition, index) => (
              <FailedConditionDisplay 
                key={index} 
                condition={condition} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FailedConditionDisplay({ condition }: { condition: FailedCondition }) {
  return (
    <div className="text-xs p-2 bg-red-50 rounded border-l-2 border-red-400">
      <div className="font-medium text-red-700">
        {condition.text}
      </div>
      <div className="mt-1 space-y-0.5 text-gray-600">
        <div>
          Verwacht: <span className="font-mono text-green-600">
            {formatValue(condition.expected)}
          </span>
        </div>
        <div>
          Werkelijk: <span className="font-mono text-red-600">
            {formatValue(condition.actual)}
          </span>
        </div>
        {condition.path && (
          <div className="text-gray-500">
            Pad: <span className="font-mono">{condition.path}</span>
          </div>
        )}
      </div>
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