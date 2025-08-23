// Main entry point
export * from './interfaces';
export { Engine } from './engine/engine';
export { Context } from './runtime/context';
export { AntlrParser } from './parsers/antlr-parser';
export { SemanticAnalyzer } from './semantic-analyzer';
export * from './ast';

// Unified predicate system
export * from './predicates/predicate-types';
export { PredicateEvaluator } from './predicates/predicate-evaluator';