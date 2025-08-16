import { AntlrParser } from '../../src/parsers/antlr-parser';

describe('ANTLR Parser Integration', () => {
  let parser: AntlrParser;

  beforeEach(() => {
    parser = new AntlrParser();
  });

  describe('Expression Parsing', () => {
    test('should parse number literal', () => {
      const expr = parser.parseExpression('42');
      expect(expr).toMatchObject({
        type: 'NumberLiteral',
        value: 42
      });
    });

    test('should parse simple addition', () => {
      const expr = parser.parseExpression('10 plus 20');
      expect(expr).toMatchObject({
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'NumberLiteral',
          value: 10
        },
        right: {
          type: 'NumberLiteral',
          value: 20
        }
      });
    });

    test('should parse variable reference', () => {
      const expr = parser.parseExpression('x');
      expect(expr).toMatchObject({
        type: 'VariableReference',
        variableName: 'x'
      });
    });

    test('should parse complex expression', () => {
      const expr = parser.parseExpression('x plus 10 maal 2');
      expect(expr).toMatchObject({
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'VariableReference',
          variableName: 'x'
        },
        right: {
          type: 'BinaryExpression',
          operator: '*',
          left: {
            type: 'NumberLiteral',
            value: 10
          },
          right: {
            type: 'NumberLiteral',
            value: 2
          }
        }
      });
    });
  });
});