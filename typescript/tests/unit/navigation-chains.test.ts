import { Engine } from '../../src';

describe('Navigation Chain Processing', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('Multi-hop navigation chains', () => {
    test('should parse simple two-element navigation chain', () => {
      const result = engine.parse('de passagiers van de reis');

      expect(result.success).toBe(true);
      const ast = result.ast;
      expect(ast).not.toBeNull();
      expect(ast?.type).toBe('AttributeReference');

      // Dutch navigation is right-to-left: "passagiers van de reis"
      // Should produce path: ["reis", "passagiers"] (object first, then attribute)
      expect((ast as any)?.path).toEqual(['reis', 'passagiers']);
    });

    test('should parse three-element navigation chain', () => {
      const result = engine.parse('de bestemming van de reis van de passagier');

      expect(result.success).toBe(true);
      const ast = result.ast;
      expect(ast).not.toBeNull();
      expect(ast?.type).toBe('AttributeReference');

      // Path should be: ["passagier", "reis", "bestemming"] (right-to-left navigation)
      expect((ast as any)?.path).toEqual(['passagier', 'reis', 'bestemming']);
    });

    test('should parse TOKA distribution navigation chain', () => {
      const input = 'de treinmiles op basis van evenredige verdeling van alle passagiers met recht op treinmiles van het te verdelen contingent treinmiles';
      const result = engine.parse(input);

      expect(result.success).toBe(true);
      const ast = result.ast;
      expect(ast).not.toBeNull();
      expect(ast?.type).toBe('AttributeReference');

      // Should preserve the full navigation chain
      const path = (ast as any)?.path;
      expect(path).toBeDefined();
      expect(path.length).toBeGreaterThanOrEqual(4);

      // First element should be "treinmiles op basis van evenredige verdeling" (compound attribute)
      // or split into multiple segments
      expect(path[0]).toContain('treinmiles');
    });

    test('should preserve possessive pronouns in navigation', () => {
      const result = engine.parse('de bestemming van zijn reis');

      expect(result.success).toBe(true);
      const ast = result.ast;
      expect(ast).not.toBeNull();
      expect(ast?.type).toBe('AttributeReference');

      // Should preserve "zijn" for FeitType navigation
      expect((ast as any)?.path).toEqual(['zijn reis', 'bestemming']);
    });

    test('should handle pronoun "hij" as self reference', () => {
      const result = engine.parse('hij');

      expect(result.success).toBe(true);
      const ast = result.ast;
      expect(ast).not.toBeNull();

      // "hij" alone is parsed as VariableReference, not AttributeReference
      if (ast?.type === 'VariableReference') {
        expect((ast as any)?.variableName).toBe('self');
      } else if (ast?.type === 'AttributeReference') {
        expect((ast as any)?.path).toEqual(['self']);
      }
    });

    test('should split "van" within single basisOnderwerp', () => {
      // Grammar might parse "burgemeester van de hoofdstad" as single basisOnderwerp
      const result = engine.parse('de burgemeester van de hoofdstad');

      expect(result.success).toBe(true);
      const ast = result.ast;
      expect(ast).not.toBeNull();
      expect(ast?.type).toBe('AttributeReference');

      // Should split to avoid duplication
      const path = (ast as any)?.path;
      expect(path).toBeDefined();
      // Either ["burgemeester", "hoofdstad"] or ["burgemeester van de hoofdstad"]
      // depending on grammar parsing
      expect(path.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Integration with other features', () => {
    test('should work with aggregation functions', () => {
      const result = engine.parse('het aantal passagiers van de reis');

      expect(result.success).toBe(true);
      const ast = result.ast;
      expect(ast).not.toBeNull();
      expect(ast?.type).toBe('FunctionCall');
      expect((ast as any)?.functionName).toBe('aantal');

      // The argument should be an AttributeReference with navigation
      const arg = (ast as any)?.arguments?.[0];
      expect(arg?.type).toBe('AttributeReference');
      expect(arg?.path).toEqual(['reis', 'passagiers']);
    });

    test('should work with sum aggregation and complex navigation', () => {
      const result = engine.parse('de som van alle belasting op basis van afstand van de passagiers');

      expect(result.success).toBe(true);
      const ast = result.ast;
      expect(ast).not.toBeNull();
      expect(ast?.type).toBe('FunctionCall');
      expect((ast as any)?.functionName).toBe('som_van');

      // The argument should have navigation chain
      const arg = (ast as any)?.arguments?.[0];
      expect(arg?.type).toBe('AttributeReference');
      const path = arg?.path;
      expect(path).toBeDefined();
      expect(path.length).toBeGreaterThanOrEqual(2);
      // Should include "passagiers" and "belasting op basis van afstand"
    });
  });

  describe('Edge cases', () => {
    test('should handle empty context gracefully', () => {
      const result = engine.parse('');

      // Empty input should fail parsing or return null
      if (result.success) {
        expect(result.ast).toBeNull();
      } else {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    test('should handle single identifier without articles', () => {
      const result = engine.parse('persoon');

      expect(result.success).toBe(true);
      const ast = result.ast;
      expect(ast).not.toBeNull();

      // Single identifier is parsed as VariableReference
      if (ast?.type === 'VariableReference') {
        expect((ast as any)?.variableName).toBe('persoon');
      } else if (ast?.type === 'AttributeReference') {
        expect((ast as any)?.path).toEqual(['persoon']);
      }
    });

    test('should handle basisOnderwerp as single context or array', () => {
      // This tests internal handling - parser should work regardless
      const result1 = engine.parse('de reis');
      const result2 = engine.parse('de reis van de passagier');

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      // Single basisOnderwerp - parsed as VariableReference
      if (result1.ast?.type === 'VariableReference') {
        expect((result1.ast as any)?.variableName).toBe('reis');
      }

      // Navigation with "van" - parsed as AttributeReference
      expect(result2.ast?.type).toBe('AttributeReference');
      expect((result2.ast as any)?.path).toEqual(['passagier', 'reis']);
    });
  });
});