import { RuntimeContext } from './runtime';
import { ExecutionResult } from './result';

/**
 * Executor interface for statement execution
 * Each executor module must implement this interface
 */
export interface IExecutor {
  execute(stmt: any, context: RuntimeContext): ExecutionResult;
}