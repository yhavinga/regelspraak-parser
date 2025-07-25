import { Engine, Context } from '../../src';
import { AggregationParser } from '../../src/parsers/aggregation-parser';
import { ExpressionEvaluator } from '../../src/evaluators/expression-evaluator';

describe('Aggregation', () => {
  describe('AggregationParser', () => {
    test('should parse "de som van X, Y en Z"', () => {
      const parser = new AggregationParser('de som van X, Y en Z');
      const result = parser.parseAggregation();
      
      expect(result).not.toBeNull();
      expect(result?.type).toBe('AggregationExpression');
      expect(result?.aggregationType).toBe('som');
      expect(Array.isArray(result?.target)).toBe(true);
      expect((result?.target as any[]).length).toBe(3);
    });

    test('should parse "het aantal personen"', () => {
      const parser = new AggregationParser('het aantal personen');
      const result = parser.parseAggregation();
      
      expect(result).not.toBeNull();
      expect(result?.aggregationType).toBe('aantal');
      expect(Array.isArray(result?.target)).toBe(false);
    });

    test('should parse "de maximale waarde van bedragen"', () => {
      const parser = new AggregationParser('de maximale waarde van bedragen');
      const result = parser.parseAggregation();
      
      expect(result).not.toBeNull();
      expect(result?.aggregationType).toBe('maximum');
    });
  });

  describe('AggregationEngine', () => {
    let evaluator: ExpressionEvaluator;
    let context: Context;

    beforeEach(() => {
      evaluator = new ExpressionEvaluator();
      context = new Context();
    });

    test('should calculate sum of multiple values', () => {
      context.setVariable('X', { type: 'number', value: 10 });
      context.setVariable('Y', { type: 'number', value: 20 });
      context.setVariable('Z', { type: 'number', value: 30 });
      
      const expr = {
        type: 'AggregationExpression' as const,
        aggregationType: 'som' as const,
        target: [
          { type: 'VariableReference', variableName: 'X' },
          { type: 'VariableReference', variableName: 'Y' },
          { type: 'VariableReference', variableName: 'Z' }
        ]
      };
      
      const result = evaluator.evaluate(expr, context);
      expect(result.type).toBe('number');
      expect(result.value).toBe(60);
    });

    test('should count values', () => {
      context.setVariable('items', { 
        type: 'list', 
        value: [
          { type: 'number', value: 1 },
          { type: 'number', value: 2 },
          { type: 'number', value: 3 }
        ]
      });
      
      const expr = {
        type: 'AggregationExpression' as const,
        aggregationType: 'aantal' as const,
        target: { type: 'VariableReference', variableName: 'items' }
      };
      
      const result = evaluator.evaluate(expr, context);
      expect(result.type).toBe('number');
      expect(result.value).toBe(3);
    });

    test('should find maximum value', () => {
      context.setVariable('values', { 
        type: 'list', 
        value: [
          { type: 'number', value: 5 },
          { type: 'number', value: 10 },
          { type: 'number', value: 3 }
        ]
      });
      
      const expr = {
        type: 'AggregationExpression' as const,
        aggregationType: 'maximum' as const,
        target: { type: 'VariableReference', variableName: 'values' }
      };
      
      const result = evaluator.evaluate(expr, context);
      expect(result.type).toBe('number');
      expect(result.value).toBe(10);
    });

    test('should find minimum value', () => {
      context.setVariable('values', { 
        type: 'list', 
        value: [
          { type: 'number', value: 5 },
          { type: 'number', value: 10 },
          { type: 'number', value: 3 }
        ]
      });
      
      const expr = {
        type: 'AggregationExpression' as const,
        aggregationType: 'minimum' as const,
        target: { type: 'VariableReference', variableName: 'values' }
      };
      
      const result = evaluator.evaluate(expr, context);
      expect(result.type).toBe('number');
      expect(result.value).toBe(3);
    });

    test('should get first value', () => {
      context.setVariable('values', { 
        type: 'list', 
        value: [
          { type: 'number', value: 5 },
          { type: 'number', value: 10 },
          { type: 'number', value: 3 }
        ]
      });
      
      const expr = {
        type: 'AggregationExpression' as const,
        aggregationType: 'eerste' as const,
        target: { type: 'VariableReference', variableName: 'values' }
      };
      
      const result = evaluator.evaluate(expr, context);
      expect(result.type).toBe('number');
      expect(result.value).toBe(5);
    });

    test('should get last value', () => {
      context.setVariable('values', { 
        type: 'list', 
        value: [
          { type: 'number', value: 5 },
          { type: 'number', value: 10 },
          { type: 'number', value: 3 }
        ]
      });
      
      const expr = {
        type: 'AggregationExpression' as const,
        aggregationType: 'laatste' as const,
        target: { type: 'VariableReference', variableName: 'values' }
      };
      
      const result = evaluator.evaluate(expr, context);
      expect(result.type).toBe('number');
      expect(result.value).toBe(3);
    });

    test('should throw error for empty collection', () => {
      context.setVariable('empty', { type: 'list', value: [] });
      
      const expr = {
        type: 'AggregationExpression' as const,
        aggregationType: 'som' as const,
        target: { type: 'VariableReference', variableName: 'empty' }
      };
      
      expect(() => evaluator.evaluate(expr, context)).toThrow('Cannot aggregate empty collection');
    });

    test('should throw error for non-numeric sum', () => {
      context.setVariable('strings', { 
        type: 'list', 
        value: [
          { type: 'string', value: 'a' },
          { type: 'string', value: 'b' }
        ]
      });
      
      const expr = {
        type: 'AggregationExpression' as const,
        aggregationType: 'som' as const,
        target: { type: 'VariableReference', variableName: 'strings' }
      };
      
      expect(() => evaluator.evaluate(expr, context)).toThrow('Cannot sum string values');
    });
  });
});