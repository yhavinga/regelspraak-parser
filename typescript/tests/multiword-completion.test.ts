import { describe, it, expect } from '@jest/globals';
import { MultiWordHandler } from '../src/parsers/multiword-handler';

describe('Multi-word Keyword Completion', () => {
  let handler: MultiWordHandler;

  beforeEach(() => {
    handler = new MultiWordHandler();
  });

  describe('Basic multi-word detection', () => {
    it('should recognize multi-word patterns from single token', () => {
      // When parser says 'groter' is expected, we should suggest 'groter dan'
      const suggestions = handler.expandToMultiWord(['groter']);
      expect(suggestions).toContain('groter dan');
      expect(suggestions).toContain('groter of gelijk aan');
    });

    it('should handle "is" expansions', () => {
      const suggestions = handler.expandToMultiWord(['is']);
      expect(suggestions).toContain('is gelijk aan');
      expect(suggestions).toContain('is groter dan');
      expect(suggestions).toContain('is kleiner dan');
      expect(suggestions).toContain('is van het type');
    });

    it('should handle "de" expansions', () => {
      const suggestions = handler.expandToMultiWord(['de']);
      expect(suggestions).toContain('de som van');
      expect(suggestions).toContain('de absolute waarde van');
      expect(suggestions).toContain('de eerste van');
    });

    it('should not duplicate single-word suggestions', () => {
      const suggestions = handler.expandToMultiWord(['parameter']);
      expect(suggestions).toContain('parameter');
      expect(suggestions.filter(s => s === 'parameter').length).toBe(1);
    });
  });

  describe('Partial completion', () => {
    it('should complete partial multi-word input', () => {
      // User typed "is gelijk" - should suggest "is gelijk aan"
      const suggestions = handler.completeMultiWord('is gelijk');
      expect(suggestions).toContain('is gelijk aan');
    });

    it('should complete "groter o" to "groter of gelijk aan"', () => {
      const suggestions = handler.completeMultiWord('groter o');
      expect(suggestions).toContain('groter of gelijk aan');
    });

    it('should handle multiple matches', () => {
      const suggestions = handler.completeMultiWord('de eerste');
      expect(suggestions).toContain('de eerste van');
      expect(suggestions).toContain('de eerste paasdag van');
    });
  });

  describe('Context integration', () => {
    it('should work with existing single tokens', () => {
      // Mix of single and multi-word expansions
      const input = ['is', 'parameter', 'de'];
      const expanded = handler.expandToMultiWord(input);
      
      expect(expanded).toContain('parameter');
      expect(expanded).toContain('is gelijk aan');
      expect(expanded).toContain('de som van');
    });

    it('should preserve original tokens', () => {
      const input = ['indien', 'anders'];
      const expanded = handler.expandToMultiWord(input);
      
      expect(expanded).toContain('indien');
      expect(expanded).toContain('anders');
    });
  });
});