import { AntlrParser } from '../src/parsers/antlr-parser';

describe('Domain value autocomplete', () => {
  let parser: AntlrParser;
  
  beforeEach(() => {
    parser = new AntlrParser();
  });
  
  it('should suggest domain values inside domain definition', () => {
    const text = `Domein Kleur {
  'rood',
  'groen',
  `;
    
    const suggestions = parser.getExpectedTokensAt(text, text.length);
    
    // Should suggest string literal placeholder for more values
    expect(suggestions).toContain("'<value>'");
  });
  
  it('should suggest domain values when parameter references domain', () => {
    const text = `Domein Status {
  'actief',
  'inactief',
  'geparkeerd'
}

Parameter klant_status: Status

Regel CheckStatus
  geldig indien klant_status is gelijk aan `;
    
    const suggestions = parser.getExpectedTokensAt(text, text.length);
    
    // Should suggest the domain values
    expect(suggestions).toContain("'actief'");
    expect(suggestions).toContain("'inactief'");
    expect(suggestions).toContain("'geparkeerd'");
  });
  
  it('should suggest domain values after IS operator with domain parameter', () => {
    const text = `Domein TypeVoertuig {
  'auto',
  'fiets',
  'motor'
}

Parameter voertuig: TypeVoertuig

Regel Test
  geldig indien voertuig is `;
    
    const suggestions = parser.getExpectedTokensAt(text, text.length);
    
    // Should include domain values
    expect(suggestions).toContain("'auto'");
    expect(suggestions).toContain("'fiets'");
    expect(suggestions).toContain("'motor'");
  });
  
  it('should suggest domain values in case statements', () => {
    const text = `Domein Seizoen {
  'lente',
  'zomer',
  'herfst',
  'winter'
}

Parameter huidige_seizoen: Seizoen

Regel Test
  wanneer huidige_seizoen
    `;
    
    const suggestions = parser.getExpectedTokensAt(text, text.length);
    
    // Should suggest case keywords and domain values
    expect(suggestions).toContain("'lente'");
    expect(suggestions).toContain("'zomer'");
  });
});