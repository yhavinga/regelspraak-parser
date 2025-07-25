import { IVisitor } from '../interfaces';
import { Expression, NumberLiteral } from '../ast/expressions';

/**
 * Visitor for building expression AST nodes from parse tree
 */
export class ExpressionVisitor implements IVisitor<Expression> {
  visit(node: any): Expression {
    // Route to specific visit methods based on node type
    const methodName = `visit${node.constructor.name}`;
    if (typeof (this as any)[methodName] === 'function') {
      return (this as any)[methodName](node);
    }
    return this.visitChildren(node);
  }

  visitChildren(node: any): Expression {
    throw new Error(`Unhandled node type: ${node.constructor.name}`);
  }

  visitNumberLiteral(node: any): NumberLiteral {
    return {
      type: 'NumberLiteral',
      value: parseFloat(node.getText())
    };
  }
}