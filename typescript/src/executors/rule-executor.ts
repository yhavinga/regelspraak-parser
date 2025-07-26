import { IRuleExecutor, RuleExecutionResult, RuntimeContext, Value } from '../interfaces';
import { Rule, Gelijkstelling, ObjectCreation, MultipleResults, ResultPart } from '../ast/rules';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';

/**
 * Executes RegelSpraak rules
 */
export class RuleExecutor implements IRuleExecutor {
  private expressionEvaluator = new ExpressionEvaluator();

  execute(rule: Rule, context: RuntimeContext): RuleExecutionResult {
    try {
      // Check if there's a condition
      if (rule.condition) {
        // Evaluate the condition
        const conditionResult = this.expressionEvaluator.evaluate(rule.condition.expression, context);
        
        // Check if condition is truthy
        if (!this.isTruthy(conditionResult)) {
          // Condition is false, skip rule execution
          return {
            success: true,
            skipped: true,
            reason: 'Condition evaluated to false'
          };
        }
      }
      
      // Execute the result part(s)
      return this.executeResultPart(rule.result, context);
    } catch (error) {
      return {
        success: false,
        error: error as Error
      };
    }
  }
  
  private executeResultPart(result: ResultPart, context: RuntimeContext): RuleExecutionResult {
    switch (result.type) {
      case 'Gelijkstelling':
        return this.executeGelijkstelling(result as Gelijkstelling, context);
      
      case 'ObjectCreation':
        return this.executeObjectCreation(result as ObjectCreation, context);
      
      case 'MultipleResults':
        return this.executeMultipleResults(result as MultipleResults, context);
      
      default:
        throw new Error(`Unsupported result type: ${(result as any).type}`);
    }
  }
  
  private executeGelijkstelling(gelijkstelling: Gelijkstelling, context: RuntimeContext): RuleExecutionResult {
    // Evaluate the expression
    const value = this.expressionEvaluator.evaluate(gelijkstelling.expression, context);
    
    // Set the variable in context
    context.setVariable(gelijkstelling.target, value);
    
    return {
      success: true,
      target: gelijkstelling.target,
      value
    };
  }
  
  private executeObjectCreation(objectCreation: ObjectCreation, context: RuntimeContext): RuleExecutionResult {
    // Generate a unique ID for the new object
    const objectId = (context as any).generateObjectId(objectCreation.objectType);
    
    // Initialize attributes
    const attributes: Record<string, Value> = {};
    
    // Create a temporary context that includes already-initialized attributes
    // This allows expressions to reference other attributes being set
    const tempContext = Object.create(context);
    tempContext.getVariable = function(name: string): Value | undefined {
      // First check if it's an attribute being initialized
      if (attributes[name] !== undefined) {
        return attributes[name];
      }
      // Otherwise delegate to the original context
      return context.getVariable(name);
    };
    
    // Evaluate each attribute initialization
    for (const init of objectCreation.attributeInits) {
      const value = this.expressionEvaluator.evaluate(init.value, tempContext);
      attributes[init.attribute] = value;
    }
    
    // Create the object in the context
    context.createObject(objectCreation.objectType, objectId, attributes);
    
    // Add to execution trace
    (context as any).addExecutionTrace(`Created ${objectCreation.objectType} with id ${objectId}`);
    
    return {
      success: true,
      objectType: objectCreation.objectType,
      objectId,
      attributes
    };
  }
  
  private executeMultipleResults(multipleResults: MultipleResults, context: RuntimeContext): RuleExecutionResult {
    const results: RuleExecutionResult[] = [];
    
    for (const result of multipleResults.results) {
      const execResult = this.executeResultPart(result, context);
      results.push(execResult);
      
      // If any result fails, stop and return the failure
      if (!execResult.success) {
        return execResult;
      }
    }
    
    return {
      success: true,
      multipleResults: results
    };
  }
  
  private isTruthy(value: Value): boolean {
    // Check if a value is considered true in a conditional context
    if (value.type === 'boolean') {
      return value.value === true;
    }
    if (value.type === 'number') {
      return value.value !== 0;
    }
    if (value.type === 'string') {
      return value.value !== '';
    }
    // For other types, consider non-null as truthy
    return value.value != null;
  }
}