/**
 * Source location information for AST nodes
 */
export interface SourceLocation {
  startLine: number;    // 1-based line number
  startColumn: number;  // 0-based column position
  endLine: number;      // 1-based line number
  endColumn: number;    // 0-based column position
}

/**
 * Map from AST nodes to their source locations
 */
export type LocationMap = WeakMap<object, SourceLocation>;

/**
 * Helper to create a SourceLocation from ANTLR context
 */
export function createSourceLocation(ctx: { start: any; stop: any }): SourceLocation {
  return {
    startLine: ctx.start.line,
    startColumn: ctx.start.column,
    endLine: ctx.stop.line,
    endColumn: ctx.stop.column
  };
}