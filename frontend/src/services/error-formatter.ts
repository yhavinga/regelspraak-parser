interface FormattedError {
  message: string;
  suggestion?: string;
  example?: string;
}

export function formatError(errorMessage: string): FormattedError {
  // Common error patterns and helpful messages
  const errorPatterns = [
    {
      pattern: /mismatched input '([^']+)' expecting 'wordt verdeeld over'/,
      message: (match: RegExpMatchArray) => `"${match[1]}" gevonden, maar dit lijkt een verkeerde regel syntax`,
      suggestion: 'Voor berekeningen gebruik "moet berekend worden als", voor verdelingen gebruik "wordt verdeeld over"',
      example: 'Het bedrag van een factuur moet berekend worden als 100 EUR.'
    },
    {
      pattern: /no viable alternative at input '([^']+)'/,
      message: (match: RegExpMatchArray) => `Onverwacht woord: "${match[1]}"`,
      suggestion: 'Controleer de spelling of gebruik een toegestaan RegelSpraak woord',
    },
    {
      pattern: /mismatched input '([^']+)' expecting \{([^}]+)\}/,
      message: (match: RegExpMatchArray) => {
        const found = match[1];
        const expected = match[2].split(',').map(s => s.trim().replace(/'/g, '')).join(', ');
        return `"${found}" gevonden, maar verwachtte één van: ${expected}`;
      },
      suggestion: 'Gebruik één van de verwachte woorden',
    },
    {
      pattern: /missing ';' at/,
      message: 'Attribuutdefinitie moet eindigen met een puntkomma (;)',
      suggestion: 'Voeg een puntkomma toe aan het einde van de attribuutdefinitie',
      example: 'de leeftijd Numeriek (geheel getal) met eenheid jr;'
    },
    {
      pattern: /extraneous input '.' expecting/,
      message: 'Punt gevonden waar die niet verwacht werd',
      suggestion: 'Verwijder de punt of controleer de regel syntax',
    },
    {
      pattern: /Unknown object type: (\w+)/,
      message: (match: RegExpMatchArray) => `Objecttype "${match[1]}" bestaat niet`,
      suggestion: 'Definieer eerst het objecttype met "Objecttype de/het ..."',
      example: 'Objecttype de Persoon\n    de naam Tekst;'
    },
    {
      pattern: /Unknown attribute: (\w+)/,
      message: (match: RegExpMatchArray) => `Attribuut "${match[1]}" bestaat niet`,
      suggestion: 'Controleer of het attribuut is gedefinieerd in het objecttype',
    },
    {
      pattern: /token recognition error at: '([^']+)'/,
      message: (match: RegExpMatchArray) => `Onbekend teken: "${match[1]}"`,
      suggestion: 'Gebruik alleen toegestane tekens in RegelSpraak',
    }
  ];
  
  // Find matching pattern
  for (const pattern of errorPatterns) {
    const match = errorMessage.match(pattern.pattern);
    if (match) {
      return {
        message: typeof pattern.message === 'function' 
          ? pattern.message(match) 
          : pattern.message,
        suggestion: pattern.suggestion,
        example: pattern.example
      };
    }
  }
  
  // Default formatting - clean up technical jargon
  let cleanMessage = errorMessage;
  cleanMessage = cleanMessage.replace(/line \d+:\d+\s*/, ''); // Remove line numbers
  cleanMessage = cleanMessage.replace(/\[@\d+,\d+:\d+='[^']+',<[^>]+>,[^:]+:\d+\]/g, ''); // Remove ANTLR tokens
  
  return {
    message: cleanMessage,
    suggestion: 'Controleer de RegelSpraak syntax'
  };
}

export function getErrorContext(code: string, line: number, column: number): string {
  const lines = code.split('\n');
  const errorLine = lines[line - 1] || '';
  
  // Show line with error pointer
  const pointer = ' '.repeat(column) + '^';
  
  return `${line}: ${errorLine}\n${' '.repeat(String(line).length + 2)}${pointer}`;
}