import { describe, it, expect } from '@jest/globals';
import { ParserBasedAutocompleteService } from '../src/parsers/parser-based-autocomplete';

describe('Parser-based Autocomplete', () => {
  let service: ParserBasedAutocompleteService;

  beforeEach(() => {
    service = new ParserBasedAutocompleteService();
  });

  describe('Basic completion from error messages', () => {
    it('should extract keywords from parser error at empty position', () => {
      const text = '';
      const position = 0;
      
      const suggestions = service.getSuggestionsAt(text, position);
      
      // Parser expects these at document start (based on error message)
      expect(suggestions).toContain('parameter');
      expect(suggestions).toContain('regel');
      expect(suggestions).toContain('feittype');
    });

    it('should provide partial word completion', () => {
      const text = 'par';
      const position = text.length;
      
      const suggestions = service.getSuggestionsAt(text, position);
      
      // Should match 'parameter' starting with 'par'
      expect(suggestions).toContain('parameter');
    });

    it('should complete "reg" to "regel"', () => {
      const text = 'reg';
      const position = text.length;
      
      const suggestions = service.getSuggestionsAt(text, position);
      
      expect(suggestions).toContain('regel');
      expect(suggestions).toContain('regelgroep');
    });
  });

  describe('Completion info', () => {
    it('should provide error message and last word', () => {
      const text = 'para';
      const position = text.length;
      
      const info = service.getCompletionInfo(text, position);
      
      expect(info.suggestions).toBeDefined();
      expect(info.errorMessage).toBeDefined();
      expect(info.lastWord).toBe('para');
    });

    it('should extract expected tokens from error', () => {
      const text = 'invalid';
      const position = text.length;
      
      const info = service.getCompletionInfo(text, position);
      
      // Should have captured error message
      expect(info.errorMessage).toBeTruthy();
      expect(info.errorMessage).toContain('expecting');
    });
  });

  describe('Context-aware completion', () => {
    it('should handle Parameter syntax correctly', () => {
      // In RegelSpraak, Parameter syntax uses : not 'is'
      const text = 'Parameter loon';
      const position = text.length;
      
      const info = service.getCompletionInfo(text, position);
      
      // Parser should expect : after parameter name
      expect(info.errorMessage).toContain(':');
    });
    
    it('should provide keyword completions from partial match', () => {
      const text = 'para';
      const position = text.length;
      
      const suggestions = service.getSuggestionsAt(text, position);
      
      // Should complete 'para' to 'parameter'
      expect(suggestions).toContain('parameter');
    });
  });
});