import { Engine, Context } from '../../src';

describe('Engine - "alle X" pattern handling', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  test('should handle "het aantal alle X" correctly', () => {
    // First just test the parsing of the expression
    const expr = 'het aantal alle Persoon';
    const parseResult = engine.parse(expr);
    
    expect(parseResult.success).toBe(true);
    const ast = parseResult.ast;
    
    expect(ast).toMatchObject({
      type: 'FunctionCall',
      functionName: 'aantal',
      arguments: [{
        type: 'AttributeReference',
        path: ['Persoon']
      }]
    });
  });

  test('should parse "de som van X van alle Y" pattern', () => {
    // Just test the parsing of the expression
    const expr = 'de som van het salaris van alle Persoon';
    const parseResult = engine.parse(expr);
    
    if (!parseResult.success) {
      console.log('Parse errors:', parseResult.errors);
    }
    
    expect(parseResult.success).toBe(true);
    const ast = parseResult.ast;
    
    // This should parse as a FunctionCall to 'som_van'
    expect(ast).toMatchObject({
      type: 'FunctionCall',
      functionName: 'som_van'
    });
    
    // Should have two arguments: attribute and collection
    expect(ast.arguments).toHaveLength(2);
    
    // First argument: attribute reference
    expect(ast.arguments[0]).toMatchObject({
      type: 'AttributeReference',
      path: ['salaris']
    });
    
    // Second argument: collection reference
    expect(ast.arguments[1]).toMatchObject({
      type: 'AttributeReference',
      path: ['Persoon']
    });
  });

  test('should parse "alle X" in conditional expressions', () => {
    const model = `
Objecttype Counter
  de waarde Numeriek;

Regelgroep Test groep
Regel maak counter
  geldig altijd
  Er wordt een nieuw Counter aangemaakt met de waarde 1
  indien het aantal alle Counter kleiner is dan 3.
`;
    
    const result = engine.parse(model);
    
    expect(result.success).toBe(true);
    if (result.ast && Array.isArray(result.ast)) {
      const regelGroep = result.ast.find((item: any) => item.type === 'RegelGroep');
      expect(regelGroep).toBeDefined();
      
      const rule = regelGroep.rules[0];
      expect(rule.condition).toBeDefined();
      
      // The condition should contain a comparison with a function call
      const condition = rule.condition.expression;
      expect(condition.type).toBe('BinaryExpression');
      expect(condition.left.type).toBe('FunctionCall');
      expect(condition.left.functionName).toBe('aantal');
      
      // The argument should be an AttributeReference to Counter
      const arg = condition.left.arguments[0];
      expect(arg.type).toBe('AttributeReference');
      expect(arg.path).toEqual(['Counter']);
    }
  });

  test('should handle uniqueness check with "alle X" pattern', () => {
    const source = `
Objecttype de Persoon
  het burgerservicenummer Tekst;
  
Consistentieregel BSN uniekheid
  De burgerservicenummers van alle Personen moeten uniek zijn.
`;
    
    const result = engine.parse(source);
    
    expect(result.success).toBe(true);
    expect(result.ast).toMatchObject({
      type: 'Model',
      rules: [{
        type: 'Rule',
        name: 'BSNuniekheid',
        result: {
          type: 'Consistentieregel',
          criteriumType: 'uniek',
          target: {
            type: 'AttributeReference',
            path: ['burgerservicenummers', 'alle', 'Personen']
          }
        }
      }]
    });
  });
});