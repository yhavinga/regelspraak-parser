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
  // ANTLR gives us the start column of the stop token, not the end
  // We need to add the token text length to get the actual end position
  const endColumn = ctx.stop ? 
    ctx.stop.column + (ctx.stop.text ? ctx.stop.text.length - 1 : 0) : 
    ctx.start.column;
    
  return {
    startLine: ctx.start.line,
    startColumn: ctx.start.column,
    endLine: ctx.stop ? ctx.stop.line : ctx.start.line,
    endColumn: endColumn
  };
}