import { describe, it, expect } from '@jest/globals';
import { improveErrorMessage } from '../src/error-improver';

describe('Error Message Improvements', () => {
  
  describe('Pattern 1: Parameter with "is een" instead of colon', () => {
    it('should suggest colon syntax for parameters', () => {
      const original = "line 1:15 mismatched input 'is' expecting ':'";
      const document = "Parameter salaris is een Bedrag;";
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toContain('💡');
      expect(improved).toContain('Parameters use colon syntax');
      expect(improved).toContain("not 'is een'");
      expect(improved).toContain('Parameter naam: Type;');
    });
  });
  
  describe('Pattern 2: Missing semicolon after parameter', () => {
    it('should suggest adding semicolon', () => {
      const original = "line 2:0 mismatched input 'Parameter' expecting {'met eenheid', 'voor elk jaar', ';'}";
      const document = "Parameter salaris: Bedrag\nParameter bonus: Bedrag;";
      const improved = improveErrorMessage(original, document, 1);
      
      expect(improved).toContain('💡');
      expect(improved).toContain('Missing semicolon');
      expect(improved).toContain('must end with a semicolon');
    });
  });
  
  describe('Pattern 3: Domain with colon instead of "is van het type"', () => {
    it('should suggest proper domain syntax', () => {
      const original = "line 1:13 mismatched input ':' expecting 'is van het type'";
      const document = 'Domein Status: "actief", "inactief";';
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("Domains require 'is van het type' syntax");
      expect(improved).toContain('Domein Status is van het type Tekst');
    });
  });
  
  describe('Pattern 4: Missing quotes in domain values', () => {
    it('should suggest quoting domain values', () => {
      const original = "line 1:35 extraneous input ':' expecting {EOF}";
      const document = "Domein Status is van het type Tekst: actief, inactief;";
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toContain('💡');
      expect(improved).toContain('Domain values must be quoted');
      expect(improved).toContain('"actief", "inactief"');
    });
  });
  
  describe('Pattern 5: Using minus sign instead of "min"', () => {
    it('should suggest using "min" operator', () => {
      const original = "line 5:25 no viable alternative at input 'a -'";
      const document = "Parameter a: Bedrag;\nParameter b: Bedrag;\nRegel Test\n  geldig altijd\n    Het verschil wordt a - b.";
      const improved = improveErrorMessage(original, document, 4);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("Use 'min' instead of '-'");
      expect(improved).toContain('a min b');
    });
  });
  
  describe('Pattern 6: Using division sign instead of "gedeeld door"', () => {
    it('should suggest using "gedeeld door" operator', () => {
      const original = "line 5:25 no viable alternative at input 'a /'";
      const document = "Parameter a: Bedrag;\nParameter b: Numeriek;\nRegel Test\n  geldig altijd\n    Het quotient wordt a / b.";
      const improved = improveErrorMessage(original, document, 4);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("Use 'gedeeld door' instead of '/'");
      expect(improved).toContain('gedeeld door');
    });
  });
  
  describe('Pattern 7: Using "if" instead of "indien"', () => {
    it('should suggest using Dutch "indien"', () => {
      const original = "line 4:4 no viable alternative at input 'if'";
      const document = "Parameter loon: Bedrag;\nRegel Test\n  geldig altijd\n    if loon > 1000\n      Het bonus wordt 100.";
      const improved = improveErrorMessage(original, document, 3);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("Use Dutch keyword 'indien'");
      expect(improved).toContain("instead of English 'if'");
      expect(improved).toContain('indien x > 10');
    });
  });
  
  describe('Pattern 8: Using English "Rule" instead of "Regel"', () => {
    it('should suggest using Dutch "Regel"', () => {
      const original = "line 2:0 extraneous input 'Rule' expecting {EOF}";
      const document = "Parameter salary: Bedrag;\nRule CalculateBonus\n  geldig altijd\n    Het bonus wordt salary maal 0.1.";
      const improved = improveErrorMessage(original, document, 1);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("Use Dutch keyword 'Regel'");
      expect(improved).toContain("instead of English 'Rule'");
      expect(improved).toContain('Regel BerekenBonus');
    });
  });
  
  describe('Pattern 9: Missing "geldig" in rule', () => {
    it('should suggest adding validity clause', () => {
      const original = "line 3:2 no viable alternative at input 'Het'";
      const document = "Parameter loon: Bedrag;\nRegel BerekenBonus\n  Het bonus wordt loon maal 0.1.";
      const improved = improveErrorMessage(original, document, 2);
      
      expect(improved).toContain('💡');
      expect(improved).toContain('Rules must have a validity clause');
      expect(improved).toContain('geldig altijd');
    });
  });
  
  describe('Pattern 10: Using = instead of "wordt"', () => {
    it('should suggest using "wordt" for assignment', () => {
      const original = "line 4:15 no viable alternative at input '='";
      const document = "Parameter salaris: Bedrag;\nRegel Test\n  geldig altijd\n    Het totaal = salaris.";
      const improved = improveErrorMessage(original, document, 3);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("Use 'wordt' for assignment");
      expect(improved).toContain("not '='");
      expect(improved).toContain('Het totaal wordt');
    });
  });
  
  describe('Pattern 11: Misspelled keywords', () => {
    it('should correct "Paramater" typo', () => {
      const original = "line 1:0 mismatched input 'Paramater' expecting {EOF, 'Parameter'}";
      const document = "Paramater salaris: Bedrag;";
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("'Parameter' is the correct keyword");
      expect(improved).toContain('Paramater, Paramter');
    });
    
    it('should correct "Paramter" typo', () => {
      const original = "line 1:0 mismatched input 'Paramter' expecting {EOF, 'Parameter'}";
      const document = "Paramter salaris: Bedrag;";
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("'Parameter' is the correct keyword");
    });
  });
  
  describe('Pattern 12: Missing colon in parameter', () => {
    it('should suggest adding colon before type', () => {
      const original = "line 1:17 mismatched input ';' expecting ':'";
      const document = "Parameter salaris;";
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toContain('💡');
      expect(improved).toContain('Parameter declarations need a colon');
      expect(improved).toContain('Parameter naam: Type;');
    });
  });
  
  describe('Pattern 13: Wrong artikel (de/het)', () => {
    it('should provide guidance on articles', () => {
      const original = "line 4:8 no viable alternative at input 'de totaal'";
      const document = "Parameter salaris: Bedrag;\nRegel Test\n  geldig altijd\n    De totaal wordt salaris.";
      const improved = improveErrorMessage(original, document, 3);
      
      expect(improved).toContain('💡');
      expect(improved).toContain('Check if you\'re using the correct article');
      expect(improved).toContain('Het totaal (neuter)');
      expect(improved).toContain('De som (common gender)');
    });
  });
  
  describe('Pattern 14: Token recognition errors for math symbols', () => {
    it('should explain + operator is valid', () => {
      const original = "token recognition error at: '+'";
      const document = "Het totaal wordt a + b.";
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("'+' operator should work");
      expect(improved).toContain('you can also use \'plus\'');
    });
    
    it('should explain * operator is valid', () => {
      const original = "token recognition error at: '*'";
      const document = "Het product wordt a * b.";
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("'*' operator should work");
      expect(improved).toContain('you can also use \'maal\'');
    });
  });
  
  describe('Pattern 15: Object type member syntax', () => {
    it('should suggest colon syntax for object members', () => {
      const original = "line 2:10 no viable alternative at input 'is een'";
      const document = "Objecttype Persoon\n  naam is een Tekst\n  leeftijd: Numeriek";
      const improved = improveErrorMessage(original, document, 1);
      
      expect(improved).toContain('💡');
      expect(improved).toContain('Object type members use colon syntax');
      expect(improved).toContain('naam: Tekst');
    });
  });
  
  describe('Pattern 16: General "expecting" errors', () => {
    it('should show expected tokens and hints', () => {
      const original = "line 1:0 mismatched input 'parameter' expecting {EOF, 'Parameter', 'Regel', 'Domein'}";
      const document = "parameter salaris: Bedrag;";
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toContain('💡');
      expect(improved).toContain('Expected one of:');
      expect(improved).toContain('Parameter');
      expect(improved).toContain('with capital P');
    });
    
    it('should suggest geldig clause when expected', () => {
      const original = "line 2:0 expecting {'geldig', '}'}";
      const document = "Regel Test\nHet resultaat wordt 1.";
      const improved = improveErrorMessage(original, document, 1);
      
      expect(improved).toContain('💡');
      expect(improved).toContain('geldig');
      expect(improved).toContain('validity clause');
    });
  });
  
  describe('Pattern 17: General fallback', () => {
    it('should provide general hints for unrecognized errors', () => {
      const original = "line 1:0 no viable alternative at input 'something'";
      const document = "something weird here";
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("parser couldn't understand");
      expect(improved).toContain('Common issues:');
      expect(improved).toContain('Wrong keyword');
      expect(improved).toContain('Missing validity clause');
    });
  });
  
  describe('Edge cases', () => {
    it('should preserve original message when no pattern matches', () => {
      const original = "some random error";
      const document = "Parameter test: Bedrag;";
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toBe(original);
      expect(improved).not.toContain('💡');
    });
    
    it('should handle empty document text', () => {
      const original = "line 1:0 mismatched input 'is' expecting ':'";
      const document = "";
      const improved = improveErrorMessage(original, document, 0);
      
      expect(improved).toContain('💡');
      expect(improved).toContain('Parameters use colon syntax');
    });
    
    it('should handle out-of-bounds line numbers', () => {
      const original = "line 10:0 no viable alternative at input '-'";
      const document = "Parameter a: Bedrag;";
      const improved = improveErrorMessage(original, document, 9);
      
      expect(improved).toContain('💡');
      expect(improved).toContain("Use 'min' instead of '-'");
    });
  });
});