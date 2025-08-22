import { AntlrParser } from '../src/parsers/antlr-parser';
import { Context } from '../src/runtime/context';
import { ExpressionEvaluator } from '../src/evaluators/expression-evaluator';
import { BinaryExpression, StringLiteral } from '../src/ast';

describe('Dagsoort Execution Tests', () => {
  it('should evaluate kerstdag using model-driven rules', () => {
    const code = `
      Dagsoort de kerstdag (mv: kerstdagen);
      
      Regel Kerstdag
        geldig altijd
          Een dag is een kerstdag
          indien de dag aan alle volgende voorwaarden voldoet:
          - de maand uit (de dag) is gelijk aan 12
          - de dag voldoet aan ten minste één van de volgende voorwaarden:
            .. de dag uit (de dag) is gelijk aan 25
            .. de dag uit (de dag) is gelijk aan 26.
    `;

    const parser = new AntlrParser();
    const model = parser.parseModel(code);
    expect(model).toBeDefined();
    const context = new Context(model);
    const evaluator = new ExpressionEvaluator();

    // Create test expression for "25-12-2024 is een dagsoort kerstdag"
    const christmasExpr: BinaryExpression = {
      type: 'BinaryExpression',
      operator: 'is een dagsoort',
      left: {
        type: 'DateLiteral',
        value: new Date(2024, 11, 25) // December 25, 2024
      },
      right: {
        type: 'StringLiteral',
        value: 'kerstdag'
      } as StringLiteral
    };

    const result = evaluator.evaluate(christmasExpr, context);
    expect(result.type).toBe('boolean');
    expect(result.value).toBe(true);

    // Test Boxing Day
    const boxingDayExpr: BinaryExpression = {
      type: 'BinaryExpression',
      operator: 'is een dagsoort',
      left: {
        type: 'DateLiteral',
        value: new Date(2024, 11, 26) // December 26, 2024
      },
      right: {
        type: 'StringLiteral',
        value: 'kerstdag'
      } as StringLiteral
    };

    const boxingResult = evaluator.evaluate(boxingDayExpr, context);
    expect(boxingResult.type).toBe('boolean');
    expect(boxingResult.value).toBe(true);

    // Test regular day
    const regularExpr: BinaryExpression = {
      type: 'BinaryExpression',
      operator: 'is een dagsoort',
      left: {
        type: 'DateLiteral',
        value: new Date(2024, 10, 15) // November 15, 2024
      },
      right: {
        type: 'StringLiteral',
        value: 'kerstdag'
      } as StringLiteral
    };

    const regularResult = evaluator.evaluate(regularExpr, context);
    expect(regularResult.type).toBe('boolean');
    expect(regularResult.value).toBe(false);
  });

  it('should return false for undefined dagsoort', () => {
    const code = `
      Dagsoort de werkdag;
    `;

    const parser = new AntlrParser();
    const model = parser.parseModel(code);
    expect(model).toBeDefined();
    const context = new Context(model);
    const evaluator = new ExpressionEvaluator();

    // Test undefined werkdag
    const werkdagExpr: BinaryExpression = {
      type: 'BinaryExpression',
      operator: 'is een dagsoort',
      left: {
        type: 'DateLiteral',
        value: new Date(2024, 10, 18) // Monday, November 18, 2024
      },
      right: {
        type: 'StringLiteral',
        value: 'werkdag'
      } as StringLiteral
    };

    // Should return false since no definition exists
    const result = evaluator.evaluate(werkdagExpr, context);
    expect(result.type).toBe('boolean');
    expect(result.value).toBe(false);
  });

  it('should evaluate simple dagsoort that is always true', () => {
    const code = `
      Dagsoort de testdag;
      
      Regel Testdag
        geldig altijd
          Een dag is een testdag.
    `;

    const parser = new AntlrParser();
    const model = parser.parseModel(code);
    expect(model).toBeDefined();
    const context = new Context(model);
    const evaluator = new ExpressionEvaluator();

    // Test any date
    const testExpr: BinaryExpression = {
      type: 'BinaryExpression',
      operator: 'is een dagsoort',
      left: {
        type: 'DateLiteral',
        value: new Date(2024, 5, 15) // June 15, 2024
      },
      right: {
        type: 'StringLiteral',
        value: 'testdag'
      } as StringLiteral
    };

    // Should always return true
    const result = evaluator.evaluate(testExpr, context);
    expect(result.type).toBe('boolean');
    expect(result.value).toBe(true);
  });

  it('should test date extraction functions', () => {
    const code = `
      Parameter de test_datum : Datum;
    `;

    const parser = new AntlrParser();
    const model = parser.parseModel(code);
    expect(model).toBeDefined();
    const context = new Context(model);
    const evaluator = new ExpressionEvaluator();

    // Test maand_uit function
    const maandExpr = {
      type: 'FunctionCall',
      functionName: 'maand_uit',
      arguments: [{
        type: 'DateLiteral',
        value: new Date(2024, 11, 25) // December 25, 2024
      }]
    };

    const maandResult = evaluator.evaluate(maandExpr, context);
    expect(maandResult.type).toBe('number');
    expect(maandResult.value).toBe(12);

    // Test dag_uit function
    const dagExpr = {
      type: 'FunctionCall',
      functionName: 'dag_uit',
      arguments: [{
        type: 'DateLiteral',
        value: new Date(2024, 11, 25) // December 25, 2024
      }]
    };

    const dagResult = evaluator.evaluate(dagExpr, context);
    expect(dagResult.type).toBe('number');
    expect(dagResult.value).toBe(25);

    // Test jaar_uit function
    const jaarExpr = {
      type: 'FunctionCall',
      functionName: 'jaar_uit',
      arguments: [{
        type: 'DateLiteral',
        value: new Date(2024, 11, 25) // December 25, 2024
      }]
    };

    const jaarResult = evaluator.evaluate(jaarExpr, context);
    expect(jaarResult.type).toBe('number');
    expect(jaarResult.value).toBe(2024);
  });
});