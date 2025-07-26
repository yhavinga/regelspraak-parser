import { IRuleExecutor, RuleExecutionResult, RuntimeContext, Value } from '../interfaces';
import { Rule, Gelijkstelling, ObjectCreation, MultipleResults, ResultPart, Kenmerktoekenning, Voorwaarde } from '../ast/rules';
import { VariableReference } from '../ast/expressions';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import { Context } from '../runtime/context';

/**
 * Executes RegelSpraak rules
 */
export class RuleExecutor implements IRuleExecutor {
  private expressionEvaluator = new ExpressionEvaluator();

  execute(rule: Rule, context: RuntimeContext): RuleExecutionResult {
    try {
      // For Kenmerktoekenning rules with conditions, we handle the condition differently
      // The condition is evaluated per object, not at the rule level
      if (rule.result.type === 'Kenmerktoekenning' && rule.condition) {
        return this.executeKenmerktoekenningWithCondition(
          rule.result as Kenmerktoekenning, 
          rule.condition, 
          context
        );
      }
      
      // Check if there's a condition for other rule types
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
      
      case 'Kenmerktoekenning':
        return this.executeKenmerktoekenning(result as Kenmerktoekenning, context);
      
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
  
  private executeKenmerktoekenning(kenmerktoekenning: Kenmerktoekenning, context: RuntimeContext): RuleExecutionResult {
    // Evaluate the subject expression to get the object(s)
    const subjectValue = this.expressionEvaluator.evaluate(kenmerktoekenning.subject, context);
    
    // The subject should reference an object or collection of objects
    if (subjectValue.type === 'object') {
      // Single object - set the characteristic
      const objectData = subjectValue.value as Record<string, Value>;
      // Kenmerken are stored with "is " prefix
      const kenmerkKey = `is ${kenmerktoekenning.characteristic}`;
      objectData[kenmerkKey] = { type: 'boolean', value: true };
      
      return {
        success: true,
        // Successfully set characteristic
      };
    } else if (subjectValue.type === 'array') {
      // Collection of objects - set characteristic on all
      const objects = subjectValue.value as Value[];
      let count = 0;
      
      for (const obj of objects) {
        if (obj.type === 'object') {
          const objectData = obj.value as Record<string, Value>;
          // Kenmerken are stored with "is " prefix
          const kenmerkKey = `is ${kenmerktoekenning.characteristic}`;
          objectData[kenmerkKey] = { type: 'boolean', value: true };
          count++;
        }
      }
      
      return {
        success: true,
        // Successfully set characteristic on multiple objects
      };
    } else {
      throw new Error(`Cannot set characteristic on value of type ${subjectValue.type}`);
    }
  }
  
  private executeKenmerktoekenningWithCondition(
    kenmerktoekenning: Kenmerktoekenning, 
    condition: Voorwaarde,
    context: RuntimeContext
  ): RuleExecutionResult {
    // Extract the object type from the subject
    // The subject should be something like { type: 'VariableReference', variableName: 'Natuurlijkpersoon' }
    const subjectExpr = kenmerktoekenning.subject;
    
    if (subjectExpr.type === 'VariableReference') {
      const varRef = subjectExpr as VariableReference;
      const objectType = varRef.variableName;
      
      // Get all objects of this type
      const objects = (context as Context).getObjectsByType(objectType);
      
      let assignedCount = 0;
      
      // For each object, evaluate the condition with the object as context
      for (const obj of objects) {
        // Create a temporary context with _subject pointing to the current object
        const tempContext = Object.create(context);
        tempContext.setVariable = context.setVariable.bind(context);
        tempContext.getVariable = function(name: string): Value | undefined {
          if (name === '_subject') {
            // The obj itself is the Value object
            return obj;
          }
          return context.getVariable(name);
        };
        
        // Evaluate the condition for this object
        const conditionResult = this.expressionEvaluator.evaluate(condition.expression, tempContext);
        
        if (this.isTruthy(conditionResult)) {
          // Condition is true, assign the characteristic
          const objectData = obj.value as Record<string, Value>;
          // Kenmerken are stored with "is " prefix
          const kenmerkKey = `is ${kenmerktoekenning.characteristic}`;
          objectData[kenmerkKey] = { type: 'boolean', value: true };
          assignedCount++;
        }
      }
      
      return {
        success: true,
        // Successfully set characteristic with condition
      };
    }
    
    throw new Error('Conditional kenmerktoekenning requires a variable reference subject');
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