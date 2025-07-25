import { Value } from './value';
import { RuntimeContext } from './runtime';

/**
 * Evaluator interface for expression evaluation
 * Each evaluator module must implement this interface
 */
export interface IEvaluator {
  evaluate(expr: any, context: RuntimeContext): Value;
}