/**
 * Visitor interface for ANTLR parse tree traversal
 * Each visitor module must implement this interface
 */
export interface IVisitor<T> {
  visit(node: any): T;
  visitChildren(node: any): T;
}