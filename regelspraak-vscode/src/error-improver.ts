/**
 * Error message improvement module
 * Transforms cryptic ANTLR errors into helpful, actionable messages
 */

export function improveErrorMessage(original: string, documentText: string, line: number): string {
  // Keep original message for debugging
  let improved = original;
  
  // Extract the relevant line of code if possible
  const lines = documentText.split('\n');
  const errorLine = lines[line] || '';
  
  // Pattern 1: Parameter with "is een" instead of colon
  if (original.includes("mismatched input 'is' expecting ':'")) {
    improved += "\n\n💡 Parameters use colon syntax, not 'is een'.";
    improved += "\n   Change: Parameter naam is een Type;";
    improved += "\n   To:     Parameter naam: Type;";
  }
  
  // Pattern 2: Missing semicolon after parameter
  else if (original.includes("mismatched input 'Parameter'") && 
           original.includes("expecting") && 
           original.includes("';'")) {
    improved += "\n\n💡 Missing semicolon at the end of the previous parameter.";
    improved += "\n   Every parameter declaration must end with a semicolon.";
    improved += "\n   Example: Parameter salaris: Bedrag;";
  }
  
  // Pattern 3: Domain syntax - using colon instead of "is van het type"
  else if (original.includes("mismatched input ':' expecting 'is van het type'")) {
    improved += "\n\n💡 Domains require 'is van het type' syntax.";
    improved += "\n   Change: Domein Status: \"actief\", \"inactief\";";
    improved += "\n   To:     Domein Status is van het type Tekst: \"actief\", \"inactief\";";
  }
  
  // Pattern 4: Missing quotes in domain values
  else if (original.includes("extraneous input ':'") && errorLine.includes("Domein")) {
    improved += "\n\n💡 Domain values must be quoted.";
    improved += "\n   Change: Domein Status is van het type Tekst: actief, inactief;";
    improved += "\n   To:     Domein Status is van het type Tekst: \"actief\", \"inactief\";";
  }
  
  // Pattern 5: Using minus sign instead of "min"
  else if (original.includes("no viable alternative") && original.includes("-")) {
    improved += "\n\n💡 Use 'min' instead of '-' for subtraction.";
    improved += "\n   Change: a - b";
    improved += "\n   To:     a min b";
  }
  
  // Pattern 6: Using division sign instead of "gedeeld door"
  else if (original.includes("no viable alternative") && original.includes("/")) {
    improved += "\n\n💡 Use 'gedeeld door' instead of '/' for division.";
    improved += "\n   Change: a / b";
    improved += "\n   To:     a gedeeld door b";
  }
  
  // Pattern 7: Using "if" instead of "indien"
  else if (original.includes("no viable alternative") && original.includes("if")) {
    improved += "\n\n💡 Use Dutch keyword 'indien' instead of English 'if'.";
    improved += "\n   Change: if x > 10";
    improved += "\n   To:     indien x > 10";
  }
  
  // Pattern 8: Using English "Rule" instead of "Regel"
  else if (original.includes("extraneous input 'Rule'") || 
           original.includes("mismatched input 'Rule'")) {
    improved += "\n\n💡 Use Dutch keyword 'Regel' instead of English 'Rule'.";
    improved += "\n   Change: Rule CalculateBonus";
    improved += "\n   To:     Regel BerekenBonus";
  }
  
  // Pattern 9: Missing "geldig" in rule
  else if (original.includes("no viable alternative") && 
           (errorLine.includes("Regel") || lines[line - 1]?.includes("Regel")) && 
           !original.includes("geldig")) {
    improved += "\n\n💡 Rules must have a validity clause.";
    improved += "\n   Add 'geldig altijd' (or another validity) after the rule name:";
    improved += "\n   Regel MijnRegel";
    improved += "\n     geldig altijd";
    improved += "\n       Het resultaat wordt ...";
  }
  
  // Pattern 10: Using = instead of "wordt"
  else if (original.includes("no viable alternative") && original.includes("=")) {
    improved += "\n\n💡 Use 'wordt' for assignment, not '='.";
    improved += "\n   Change: Het totaal = salaris plus bonus.";
    improved += "\n   To:     Het totaal wordt salaris plus bonus.";
  }
  
  // Pattern 11: Misspelled keywords (common typos)
  else if (original.includes("mismatched input 'Paramater'") || 
           original.includes("mismatched input 'Paramter'")) {
    improved += "\n\n💡 Spelling error: 'Parameter' is the correct keyword.";
    improved += "\n   Common misspellings: Paramater, Paramter, Parmaeter";
  }
  
  // Pattern 12: Missing colon in parameter declaration
  else if (original.includes("mismatched input ';' expecting ':'")) {
    improved += "\n\n💡 Parameter declarations need a colon before the type.";
    improved += "\n   Change: Parameter naam;";
    improved += "\n   To:     Parameter naam: Type;";
  }
  
  // Pattern 13: Wrong artikel (de/het) - provide general guidance
  else if (original.includes("no viable alternative") && 
           (errorLine.includes(" de ") || errorLine.includes(" het ") || 
            errorLine.includes(" De ") || errorLine.includes(" Het "))) {
    improved += "\n\n💡 Check if you're using the correct article (de/het/een).";
    improved += "\n   Common patterns:";
    improved += "\n   - Het totaal (neuter)";
    improved += "\n   - De som (common gender)";
    improved += "\n   - Een bedrag (indefinite)";
  }
  
  // Pattern 14: Token recognition errors for math symbols
  else if (original.includes("token recognition error at: '+'")) {
    improved += "\n\n💡 The '+' operator should work, but you can also use 'plus'.";
    improved += "\n   Both are valid: a + b  OR  a plus b";
  }
  else if (original.includes("token recognition error at: '*'")) {
    improved += "\n\n💡 The '*' operator should work, but you can also use 'maal'.";
    improved += "\n   Both are valid: a * b  OR  a maal b";
  }
  
  // Pattern 15: Object type member syntax errors
  else if (original.includes("no viable alternative at input 'is een'") && 
           documentText.includes("Objecttype")) {
    improved += "\n\n💡 Object type members use colon syntax, not 'is een'.";
    improved += "\n   Inside an Objecttype:";
    improved += "\n   Change:  naam is een Tekst";
    improved += "\n   To:      naam: Tekst";
  }
  
  // Pattern 16: General "expecting" errors - show what was expected
  else if (original.includes("expecting {")) {
    const expectedMatch = original.match(/expecting \{([^}]+)\}/);
    if (expectedMatch) {
      const expected = expectedMatch[1].split(', ')
        .filter(t => !t.includes('EOF'))
        .slice(0, 3)  // Show only first 3 options
        .map(t => t.replace(/'/g, ''));
      
      if (expected.length > 0) {
        improved += "\n\n💡 Expected one of: " + expected.join(', ');
        
        // Provide specific hints for common expected tokens
        if (expected.includes('Parameter')) {
          improved += "\n   Did you mean to write 'Parameter' (with capital P)?";
        }
        if (expected.includes('geldig')) {
          improved += "\n   Rules need a validity clause: 'geldig altijd' or 'geldig indien ...'";
        }
      }
    }
  }
  
  // Pattern 17: No viable alternative - general hint
  else if (original.includes("no viable alternative at input") && 
           !improved.includes("💡")) {
    improved += "\n\n💡 The parser couldn't understand this syntax.";
    improved += "\n   Common issues:";
    improved += "\n   - Wrong keyword (English instead of Dutch)";
    improved += "\n   - Missing validity clause in rules";
    improved += "\n   - Wrong operator (use 'plus', 'min', 'maal', 'gedeeld door')";
    improved += "\n   - Missing semicolon at end of statement";
  }
  
  return improved;
}