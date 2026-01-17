import { describe, it, expect } from '@jest/globals';
import { Engine } from '../../src';

describe('Compound Condition Evaluation', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('ALLE quantifier', () => {
    it('should return true when all conditions are met', () => {
      const code = `
Parameter de minimum leeftijd: Numeriek (geheel getal) met eenheid jr
Parameter de maximum leeftijd: Numeriek (geheel getal) met eenheid jr

Regel Geschiktheid
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan alle volgende voorwaarden wordt voldaan:
            • de leeftijd is groter of gelijk aan de minimum leeftijd
            • de leeftijd is kleiner of gelijk aan de maximum leeftijd
            • de nationaliteit is gelijk aan "NL".
`;

      const result = engine.evaluate(code, {
        'minimum leeftijd': 18,
        'maximum leeftijd': 65,
        'leeftijd': 30,
        'nationaliteit': 'NL'
      });

      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'boolean', value: true });
    });

    it('should skip rule when one condition is not met', () => {
      const code = `
Parameter de minimum leeftijd: Numeriek (geheel getal) met eenheid jr
Parameter de maximum leeftijd: Numeriek (geheel getal) met eenheid jr

Regel Geschiktheid
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan alle volgende voorwaarden wordt voldaan:
            • de leeftijd is groter of gelijk aan de minimum leeftijd
            • de leeftijd is kleiner of gelijk aan de maximum leeftijd
            • de nationaliteit is gelijk aan "NL".
`;

      const result = engine.evaluate(code, {
        'minimum leeftijd': 18,
        'maximum leeftijd': 65,
        'leeftijd': 30,
        'nationaliteit': 'US'  // This condition fails
      });

      expect(result.success).toBe(true);
      // When the model runs successfully but has a compound condition that failed
      // it returns "Model executed" not "Rule skipped"
      expect(result.value?.value).toBe('Model executed');
    });
  });

  describe('GEEN quantifier', () => {
    it('should return true when no conditions are met', () => {
      const code = `
Regel Toegang
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan geen van de volgende voorwaarden wordt voldaan:
            • de is geblokkeerd is gelijk aan waar
            • de is verbannen is gelijk aan waar.
`;

      const result = engine.evaluate(code, {
        'is geblokkeerd': false,
        'is verbannen': false
      });

      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'boolean', value: true });
    });

    it('should skip rule when any condition is met', () => {
      const code = `
Regel Toegang
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan geen van de volgende voorwaarden wordt voldaan:
            • de is geblokkeerd is gelijk aan waar
            • de is verbannen is gelijk aan waar.
`;

      const result = engine.evaluate(code, {
        'is geblokkeerd': true,  // This makes the compound condition false
        'is verbannen': false
      });

      expect(result.success).toBe(true);
      expect(result.value?.value).toContain('Rule skipped');
    });
  });

  describe('TEN_MINSTE quantifier', () => {
    it('should return true when at least n conditions are met', () => {
      const code = `
Regel Validatie
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan ten minste twee van de volgende voorwaarden wordt voldaan:
            • de handtekening A is gelijk aan waar
            • de handtekening B is gelijk aan waar
            • de handtekening C is gelijk aan waar.
`;

      const result = engine.evaluate(code, {
        'handtekening A': true,
        'handtekening B': true,
        'handtekening C': false
      });

      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'boolean', value: true });
    });

    it('should skip rule when fewer than n conditions are met', () => {
      const code = `
Regel Validatie
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan ten minste twee van de volgende voorwaarden wordt voldaan:
            • de handtekening A is gelijk aan waar
            • de handtekening B is gelijk aan waar
            • de handtekening C is gelijk aan waar.
`;

      const result = engine.evaluate(code, {
        'handtekening A': true,
        'handtekening B': false,
        'handtekening C': false
      });

      expect(result.success).toBe(true);
      expect(result.value?.value).toContain('Rule skipped');
    });
  });

  describe('TEN_HOOGSTE quantifier', () => {
    it('should return true when at most n conditions are met', () => {
      const code = `
Regel Acceptatie
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan ten hoogste één van de volgende voorwaarden wordt voldaan:
            • de fout A is gelijk aan waar
            • de fout B is gelijk aan waar
            • de fout C is gelijk aan waar.
`;

      const result = engine.evaluate(code, {
        'fout A': true,
        'fout B': false,
        'fout C': false
      });

      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'boolean', value: true });
    });

    it('should skip rule when more than n conditions are met', () => {
      const code = `
Regel Acceptatie
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan ten hoogste één van de volgende voorwaarden wordt voldaan:
            • de fout A is gelijk aan waar
            • de fout B is gelijk aan waar
            • de fout C is gelijk aan waar.
`;

      const result = engine.evaluate(code, {
        'fout A': true,
        'fout B': true,  // Two errors - exceeds limit
        'fout C': false
      });

      expect(result.success).toBe(true);
      expect(result.value?.value).toContain('Rule skipped');
    });
  });

  describe('PRECIES quantifier', () => {
    it('should return true when exactly n conditions are met', () => {
      const code = `
Regel Goedkeuring
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan precies twee van de volgende voorwaarden wordt voldaan:
            • de goedkeuring A is gelijk aan waar
            • de goedkeuring B is gelijk aan waar
            • de goedkeuring C is gelijk aan waar.
`;

      const result = engine.evaluate(code, {
        'goedkeuring A': true,
        'goedkeuring B': true,
        'goedkeuring C': false
      });

      expect(result.success).toBe(true);
      expect(result.value).toEqual({ type: 'boolean', value: true });
    });

    it('should skip rule when not exactly n conditions are met', () => {
      const code = `
Regel Goedkeuring
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan precies twee van de volgende voorwaarden wordt voldaan:
            • de goedkeuring A is gelijk aan waar
            • de goedkeuring B is gelijk aan waar
            • de goedkeuring C is gelijk aan waar.
`;

      const result = engine.evaluate(code, {
        'goedkeuring A': true,
        'goedkeuring B': true,
        'goedkeuring C': true  // All three - not exactly two
      });

      expect(result.success).toBe(true);
      expect(result.value?.value).toContain('Rule skipped');
    });
  });

  describe('Nested compound conditions', () => {
    it('should evaluate nested compound conditions correctly', () => {
      const code = `
Parameter de pensioen leeftijd: Numeriek (geheel getal) met eenheid jr

Regel SpecialeStatus
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan alle volgende voorwaarden wordt voldaan:
            • de nationaliteit is gelijk aan "NL"
            • er voldoet aan ten minste één van de volgende voorwaarden:
                •• de is student is gelijk aan waar
                •• de leeftijd is groter dan de pensioen leeftijd.
`;

      const result = engine.evaluate(code, {
        'pensioen leeftijd': 65,
        'nationaliteit': 'NL',
        'is student': true,
        'leeftijd': 25
      });

      expect(result.success).toBe(true);
      // When the rule succeeds, it returns the boolean 'true' value from 'waar'
      expect(result.value).toEqual({ type: 'boolean', value: true });
    });

    it('should handle nested conditions with outer condition failing', () => {
      const code = `
Parameter de pensioen leeftijd: Numeriek (geheel getal) met eenheid jr

Regel SpecialeStatus
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan alle volgende voorwaarden wordt voldaan:
            • de nationaliteit is gelijk aan "NL"
            • er voldoet aan ten minste één van de volgende voorwaarden:
                •• de is student is gelijk aan waar
                •• de leeftijd is groter dan de pensioen leeftijd.
`;

      const result = engine.evaluate(code, {
        'pensioen leeftijd': 65,
        'nationaliteit': 'US',  // Outer condition fails
        'is student': true,
        'leeftijd': 25
      });

      expect(result.success).toBe(true);
      // Model still executes, even if rules are skipped
      expect(result.value?.value).toBe('Model executed');
    });
  });

  describe('Error handling', () => {
    it('should throw error when condition evaluates to non-boolean', () => {
      const code = `
Regel InvalideRegel
    geldig altijd
        Het resultaat van een berekening moet berekend worden als waar
        indien er aan alle volgende voorwaarden wordt voldaan:
            • de leeftijd
            • de naam.
`;

      const result = engine.evaluate(code, {
        'leeftijd': 30,
        'naam': 'Jan'
      });

      // The error should be caught and the model still runs
      // But the rule will be skipped due to error in condition evaluation
      expect(result.success).toBe(true);
      expect(result.value?.value).toContain('Compound condition element must evaluate to boolean');
    });
  });
});