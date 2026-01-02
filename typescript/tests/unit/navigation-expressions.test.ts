import { Engine, Context } from '../../src';

describe('Engine - Navigation Expressions', () => {
  let engine: Engine;
  let context: Context;

  beforeEach(() => {
    engine = new Engine();
    context = new Context();
  });

  describe('simple navigation', () => {
    test('should evaluate simple navigation expression', () => {
      // Setup nested object structure
      const persoon = {
        type: 'object',
        value: {
          naam: { type: 'string', value: 'Jan' },
          leeftijd: { type: 'number', value: 30 }
        }
      };
      context.setVariable('persoon', persoon);

      const result = engine.run('de naam van persoon', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'string', value: 'Jan' });
    });

    test('should evaluate navigation with article in attribute', () => {
      const klant = {
        type: 'object',
        value: {
          inkomen: { type: 'number', value: 50000 }
        }
      };
      context.setVariable('klant', klant);

      const result = engine.run('het inkomen van klant', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'number', value: 50000 });
    });

    test('should evaluate navigation with "de" article in object reference', () => {
      const persoon = {
        type: 'object',
        value: {
          leeftijd: { type: 'number', value: 25 }
        }
      };
      context.setVariable('persoon', persoon);

      const result = engine.run('de leeftijd van de persoon', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'number', value: 25 });
    });
  });

  describe('nested navigation', () => {
    test('should evaluate two-level navigation', () => {
      const adres = {
        type: 'object',
        value: {
          straat: { type: 'string', value: 'Hoofdstraat' }
        }
      };
      const persoon = {
        type: 'object',
        value: {
          adres: adres
        }
      };
      context.setVariable('persoon', persoon);

      const result = engine.run('de straat van het adres van persoon', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'string', value: 'Hoofdstraat' });
    });

    test('should evaluate three-level navigation', () => {
      const burgemeester = {
        type: 'object',
        value: {
          naam: { type: 'string', value: 'Piet' }
        }
      };
      const hoofdstad = {
        type: 'object',
        value: {
          burgemeester: burgemeester
        }
      };
      context.setVariable('hoofdstad', hoofdstad);

      const result = engine.run('de naam van de burgemeester van de hoofdstad', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'string', value: 'Piet' });
    });
  });

  describe('navigation in expressions', () => {
    test('should use navigation in arithmetic expression', () => {
      const factuur = {
        type: 'object',
        value: {
          bedrag: { type: 'number', value: 100 },
          btw: { type: 'number', value: 21 }
        }
      };
      context.setVariable('factuur', factuur);

      const result = engine.run('het bedrag van factuur plus de btw van factuur', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'number', value: 121 });
    });

    test('should use navigation in comparison', () => {
      const persoon = {
        type: 'object',
        value: {
          leeftijd: { type: 'number', value: 70 }
        }
      };
      context.setVariable('persoon', persoon);

      const result = engine.run('de leeftijd van persoon groter is dan 65', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'boolean', value: true });
    });
  });

  describe('error handling', () => {
    test('should fail on undefined object', () => {
      const result = engine.run('de naam van onbekendePersoon', context);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Undefined variable: onbekendePersoon');
    });

    test('should fail on undefined attribute', () => {
      const persoon = {
        type: 'object',
        value: {
          naam: { type: 'string', value: 'Jan' }
        }
      };
      context.setVariable('persoon', persoon);

      const result = engine.run('de leeftijd van persoon', context);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain("Attribute 'leeftijd' not found");
    });

    test('should fail on non-object navigation', () => {
      context.setVariable('nummer', { type: 'number', value: 42 });

      const result = engine.run('de waarde van nummer', context);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Cannot get attribute');
    });
  });

  describe('multi-word attributes', () => {
    test('should handle multi-word attribute names', () => {
      const project = {
        type: 'object',
        value: {
          'totale kosten': { type: 'number', value: 75000 }
        }
      };
      context.setVariable('project', project);

      const result = engine.run('de totale kosten van project', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'number', value: 75000 });
    });

    test('should handle attribute with underscores', () => {
      const persoon = {
        type: 'object',
        value: {
          'volledige_naam': { type: 'string', value: 'Jan de Vries' }
        }
      };
      context.setVariable('persoon', persoon);

      const result = engine.run('de volledige_naam van persoon', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'string', value: 'Jan de Vries' });
    });
  });
});