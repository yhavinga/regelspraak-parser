export interface FormattedError {
  message: string;
  suggestion?: string;
  example?: string;
}

export interface ErrorExplanation {
  what: string;      // Wat is er fout?
  why: string;       // Waarom is dit fout?
  how: string;       // Hoe los je het op?
  example?: string;  // Voorbeeld van correcte syntax
}

export interface QuickFix {
  description: string;
  edit: {
    line: number;
    column?: number;
    text?: string;
    find?: string;
    replace?: string;
  };
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

const errorDatabase: Record<string, ErrorExplanation> = {
  'missing-period': {
    what: 'Er ontbreekt een punt aan het einde van de regel',
    why: 'Elke regel in RegelSpraak moet eindigen met een punt',
    how: 'Voeg een punt (.) toe aan het einde van de regel',
    example: 'De leeftijd van een Persoon is 18 jaar.'
  },
  
  'missing-semicolon': {
    what: 'Er ontbreekt een puntkomma aan het einde van de attribuutdefinitie',
    why: 'Attribuutdefinities in objecttypes moeten eindigen met een puntkomma',
    how: 'Voeg een puntkomma (;) toe aan het einde van de attribuutdefinitie',
    example: 'de leeftijd Numeriek (geheel getal) met eenheid jr;'
  },
  
  'unknown-object': {
    what: 'Dit objecttype bestaat nog niet',
    why: 'Je probeert een objecttype te gebruiken dat nog niet is gedefinieerd',
    how: 'Definieer eerst het objecttype met "Objecttype de/het [naam]"',
    example: 'Objecttype de Persoon\n    de naam Tekst;\n    de leeftijd Numeriek;'
  },
  
  'unknown-attribute': {
    what: 'Dit attribuut bestaat niet voor dit objecttype',
    why: 'Het attribuut is niet gedefinieerd in het objecttype',
    how: 'Controleer de spelling of voeg het attribuut toe aan het objecttype',
    example: '// In objecttype definitie:\nde leeftijd Numeriek met eenheid jr;'
  },
  
  'invalid-article': {
    what: 'Verkeerd lidwoord gebruikt',
    why: 'Het lidwoord moet overeenkomen met het objecttype (de/het)',
    how: 'Gebruik het juiste lidwoord zoals gedefinieerd in het objecttype',
    example: '// Als gedefinieerd: "Objecttype de Persoon"\n// Dan gebruik: "de Persoon", niet "het Persoon"'
  },
  
  'mismatched-expecting': {
    what: 'Onverwachte syntax gevonden',
    why: 'RegelSpraak verwacht specifieke woorden of syntax op deze positie',
    how: 'Gebruik de juiste RegelSpraak syntax',
    example: 'Voor berekeningen: "moet berekend worden als"\nVoor verdelingen: "wordt verdeeld over"'
  },
  
  'invalid-token': {
    what: 'Onbekend teken of woord',
    why: 'Dit teken of woord is niet toegestaan in RegelSpraak',
    how: 'Gebruik alleen geldige RegelSpraak woorden en tekens'
  }
};

export function getDetailedErrorExplanation(errorMessage: string): ErrorExplanation | null {
  // Match error to explanation
  if (errorMessage.includes('Expected "."') || errorMessage.includes("expecting '.'")) {
    return errorDatabase['missing-period'];
  }
  if (errorMessage.includes('Expected ";"') || errorMessage.includes("expecting ';'") || errorMessage.includes("missing ';'")) {
    return errorDatabase['missing-semicolon'];
  }
  if (errorMessage.includes('Unknown object type')) {
    return errorDatabase['unknown-object'];
  }
  if (errorMessage.includes('Unknown attribute')) {
    return errorDatabase['unknown-attribute'];
  }
  if (errorMessage.includes('mismatched input') && errorMessage.includes('expecting')) {
    return errorDatabase['mismatched-expecting'];
  }
  if (errorMessage.includes('token recognition error') || errorMessage.includes('no viable alternative')) {
    return errorDatabase['invalid-token'];
  }
  
  return null;
}

export function getSuggestedFix(errorMessage: string, code: string, line: number): QuickFix | null {
  const lines = code.split('\n');
  const errorLine = lines[line - 1] || '';
  
  // Missing period
  if ((errorMessage.includes('Expected "."') || errorMessage.includes("expecting '.'")) && 
      !errorLine.trim().endsWith('.')) {
    return {
      description: 'Voeg punt toe',
      edit: {
        line: line,
        column: errorLine.length + 1,
        text: '.'
      }
    };
  }
  
  // Missing semicolon in object definition
  if ((errorMessage.includes('Expected ";"') || errorMessage.includes("expecting ';'") || errorMessage.includes("missing ';'")) && 
      !errorLine.trim().endsWith(';')) {
    return {
      description: 'Voeg puntkomma toe',
      edit: {
        line: line,
        column: errorLine.length + 1,
        text: ';'
      }
    };
  }
  
  // Extraneous period
  if (errorMessage.includes("extraneous input '.'")) {
    return {
      description: 'Verwijder overbodige punt',
      edit: {
        line: line,
        find: '..',
        replace: '.'
      }
    };
  }
  
  // Wrong berekening syntax
  if (errorMessage.includes("mismatched input") && 
      errorMessage.includes("expecting 'wordt verdeeld over'") &&
      errorLine.includes("moet berekend worden als")) {
    return {
      description: 'Dit lijkt een berekening, geen verdeling',
      edit: {
        line: line,
        find: 'wordt verdeeld over',
        replace: 'moet berekend worden als'
      }
    };
  }
  
  return null;
}

export interface Suggestion {
  line: number;
  message: string;
  severity: 'warning' | 'info';
  fix?: {
    find: string;
    replace: string;
  };
}

export function detectCommonMistakes(code: string): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Missing period at end of rule
    if (line.trim() && 
        (line.includes('moet') || line.includes('is') || line.includes('wordt')) &&
        !line.trim().endsWith('.') &&
        !line.trim().endsWith(',') &&
        !line.trim().endsWith(';') &&
        !line.includes('//')) {
      suggestions.push({
        line: lineNum,
        message: 'Regel lijkt niet afgesloten met een punt',
        severity: 'warning'
      });
    }
    
    // Common typos
    const typos: Record<string, string> = {
      'Objekttype': 'Objecttype',
      'objekttype': 'Objecttype',
      'Pararmeter': 'Parameter',
      'pararmeter': 'Parameter',
      'als': 'indien',     // wrong conditional keyword
      'groter dan': 'groter is dan',
      'kleiner dan': 'kleiner is dan',
      'gelijk aan': 'gelijk is aan',
      'word': 'wordt',
      'bereken': 'berekend',
      'definieer': 'Objecttype',
    };
    
    Object.entries(typos).forEach(([wrong, right]) => {
      if (line.includes(wrong)) {
        suggestions.push({
          line: lineNum,
          message: `Mogelijk typfout: "${wrong}" → "${right}"`,
          severity: 'info',
          fix: {
            find: wrong,
            replace: right
          }
        });
      }
    });
    
    // Indentation issues
    if (line.length > 0 && !line.startsWith('    ') && 
        (previousLineStartsWith(lines, index, 'Objecttype') ||
         previousLineStartsWith(lines, index, 'Regel') ||
         previousLineStartsWith(lines, index, 'Parameter'))) {
      suggestions.push({
        line: lineNum,
        message: 'Inhoud moet ingesprongen zijn met 4 spaties',
        severity: 'warning'
      });
    }
    
    // Mixed language detection
    if (line.match(/\b(if|then|else|while|for|function|var|let|const)\b/)) {
      suggestions.push({
        line: lineNum,
        message: 'Gebruik Nederlandse RegelSpraak syntax, geen Engels',
        severity: 'warning'
      });
    }
    
    // Missing article
    if (line.match(/\bvan\s+[A-Z]\w+\b/) && !line.match(/\bvan\s+(de|het|een)\s+[A-Z]\w+\b/)) {
      suggestions.push({
        line: lineNum,
        message: 'Mogelijk ontbreekt een lidwoord (de/het) voor het objecttype',
        severity: 'info'
      });
    }
  });
  
  return suggestions;
}

function previousLineStartsWith(lines: string[], index: number, prefix: string): boolean {
  if (index === 0) return false;
  return lines[index - 1].trim().startsWith(prefix);
}