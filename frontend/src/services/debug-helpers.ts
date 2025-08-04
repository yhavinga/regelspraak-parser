import { SkippedRule, FailedCondition } from './execution-service';

export interface DebugSuggestion {
  type: 'value-change' | 'add-object' | 'check-scope';
  description: string;
  action?: {
    path: string;
    suggestedValue: any;
  };
}

export function getSuggestionsForSkippedRule(
  skipped: SkippedRule
): DebugSuggestion[] {
  const suggestions: DebugSuggestion[] = [];
  
  if (skipped.reason === 'condition-failed') {
    skipped.failedConditions.forEach(condition => {
      if (condition.expected !== undefined && condition.actual !== undefined) {
        suggestions.push({
          type: 'value-change',
          description: `Verander ${condition.path || 'waarde'} naar ${formatValue(condition.expected)}`,
          action: {
            path: condition.path || '',
            suggestedValue: condition.expected
          }
        });
      }
    });
  }
  
  if (skipped.reason === 'invalid-scope') {
    suggestions.push({
      type: 'check-scope',
      description: 'Controleer of de regel geldig is voor het juiste objecttype'
    });
  }
  
  if (skipped.reason === 'not-applicable') {
    suggestions.push({
      type: 'add-object',
      description: 'Mogelijk ontbreekt het object waarop deze regel van toepassing is'
    });
  }
  
  return suggestions;
}

export function explainConditionFailure(condition: FailedCondition): string {
  const { text, expected, actual } = condition;
  
  // Pattern matching for common conditions
  if (text.includes('groter') && text.includes('dan')) {
    return `De waarde (${formatValue(actual)}) moet groter zijn dan ${formatValue(expected)}`;
  }
  
  if (text.includes('kleiner') && text.includes('dan')) {
    return `De waarde (${formatValue(actual)}) moet kleiner zijn dan ${formatValue(expected)}`;
  }
  
  if (text.includes('gelijk') && text.includes('aan')) {
    return `De waarde (${formatValue(actual)}) moet gelijk zijn aan ${formatValue(expected)}`;
  }
  
  if (text.includes('indien')) {
    return `De voorwaarde "${text}" is niet waar`;
  }
  
  return `Verwacht: ${formatValue(expected)}, maar kreeg: ${formatValue(actual)}`;
}

export function generateTestDataFix(
  currentData: any,
  suggestions: DebugSuggestion[]
): any {
  const fixedData = JSON.parse(JSON.stringify(currentData));
  
  suggestions.forEach(suggestion => {
    if (suggestion.type === 'value-change' && suggestion.action) {
      setValueByPath(fixedData, suggestion.action.path, suggestion.action.suggestedValue);
    }
  });
  
  return fixedData;
}

function setValueByPath(obj: any, path: string, value: any): void {
  if (!path) return;
  
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  
  current[parts[parts.length - 1]] = value;
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return 'leeg';
  if (typeof value === 'boolean') return value ? 'waar' : 'onwaar';
  if (typeof value === 'object' && value.value !== undefined) {
    return `${value.value}${value.unit ? ' ' + value.unit : ''}`;
  }
  return String(value);
}