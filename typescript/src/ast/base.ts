/**
 * Base interface for ALL AST nodes
 * 
 * As Dijkstra said: "The quality of programmers is a decreasing function 
 * of the density of go to statements in the programs they produce."
 * 
 * Similarly, the quality of an AST is a decreasing function of the number
 * of nodes without location information.
 */

import { SourceLocation } from './location';

/**
 * Every AST node MUST have:
 * 1. A type discriminator
 * 2. A source location
 * 
 * No exceptions. This is not negotiable.
 */
export interface ASTNode {
  type: string;
  location: SourceLocation;
}