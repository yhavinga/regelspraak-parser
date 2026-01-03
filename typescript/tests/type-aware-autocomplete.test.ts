import { AntlrParser } from '../src/parsers/antlr-parser';

describe('Type-aware autocomplete', () => {
  let parser: AntlrParser;

  beforeEach(() => {
    parser = new AntlrParser();
  });

  it('should suggest all parameter types after indien (conditions can compare any type)', () => {
    // After "indien" we suggest ALL parameters because conditions can compare any types
    // Examples: "indien leeftijd > 18", "indien naam gelijk aan 'test'", "indien is_actief"
    const text = `Parameter is_actief: Boolean
Parameter leeftijd: Numeriek
Parameter naam: Tekst
Parameter heeft_schuld: Boolean

Regel Check
  geldig indien `;

    const suggestions = parser.getExpectedTokensAt(text, text.length);

    // All parameter types are valid in conditions
    expect(suggestions).toContain('is_actief');
    expect(suggestions).toContain('heeft_schuld');
    expect(suggestions).toContain('leeftijd');  // "indien leeftijd > 18" is valid
    expect(suggestions).toContain('naam');       // "indien naam = 'test'" is valid
  });

  it('should suggest numeric types in arithmetic expressions', () => {
    const text = `Parameter salaris: Bedrag
Parameter bonus: Bedrag
Parameter naam: Tekst
Parameter actief: Boolean
Parameter percentage: Percentage

Regel Calculate
  totaal = salaris + `;

    const suggestions = parser.getExpectedTokensAt(text, text.length);

    // Should include numeric-compatible parameters
    expect(suggestions).toContain('bonus');
    expect(suggestions).toContain('percentage');

    // Should NOT include non-numeric parameters
    expect(suggestions).not.toContain('naam');
    expect(suggestions).not.toContain('actief');
  });

  it('should suggest date parameters in date operations', () => {
    const text = `Parameter start_datum: Datum
Parameter eind_datum: Datum
Parameter naam: Tekst
Parameter bedrag: Bedrag

Regel DateCalc
  periode = eind_datum - `;

    const suggestions = parser.getExpectedTokensAt(text, text.length);

    // Should include date parameters
    expect(suggestions).toContain('start_datum');

    // Should NOT include non-date parameters
    expect(suggestions).not.toContain('naam');
    expect(suggestions).not.toContain('bedrag');
  });

  it('should suggest type-compatible parameters in comparisons', () => {
    const text = `Parameter prijs_a: Bedrag
Parameter prijs_b: Bedrag
Parameter naam: Tekst
Parameter datum: Datum

Regel Compare
  geldig indien prijs_a > `;

    const suggestions = parser.getExpectedTokensAt(text, text.length);

    // Should include same-type parameters
    expect(suggestions).toContain('prijs_b');

    // Should NOT include incompatible types
    expect(suggestions).not.toContain('naam');
    expect(suggestions).not.toContain('datum');
  });

  it('should handle mixed numeric types correctly', () => {
    const text = `Parameter aantal: Aantal
Parameter percentage: Percentage
Parameter bedrag: Bedrag
Parameter getal: Numeriek
Parameter tekst: Tekst

Regel Mixed
  resultaat = aantal * `;

    const suggestions = parser.getExpectedTokensAt(text, text.length);

    // All numeric types should be compatible
    expect(suggestions).toContain('percentage');
    expect(suggestions).toContain('bedrag');
    expect(suggestions).toContain('getal');

    // Non-numeric should be excluded
    expect(suggestions).not.toContain('tekst');
  });
});