import { Rule } from '../ast/rules';
import { RuntimeContext, Value } from './';

export interface RuleExecutionResult {
  success: boolean;
  target?: string;
  value?: Value;
  error?: Error;
  skipped?: boolean;
  reason?: string;
}

export interface IRuleExecutor {
  execute(rule: Rule, context: RuntimeContext): RuleExecutionResult;
}