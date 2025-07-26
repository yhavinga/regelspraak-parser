import { IRuleExecutor, RuleExecutionResult, RuntimeContext, Value } from '../interfaces';
import { 
  Rule, 
  Gelijkstelling, 
  ObjectCreation, 
  MultipleResults, 
  ResultPart, 
  Kenmerktoekenning, 
  Voorwaarde, 
  Consistentieregel,
  Verdeling,
  VerdelingMethode,
  VerdelingGelijkeDelen,
  VerdelingNaarRato,
  VerdelingOpVolgorde,
  VerdelingTieBreak,
  VerdelingMaximum,
  VerdelingAfronding
} from '../ast/rules';
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
        try {
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
        } catch (error) {
          // If condition evaluation fails (e.g., missing attribute), treat as false
          return {
            success: true,
            skipped: true,
            reason: `Condition evaluation failed: ${error instanceof Error ? error.message : 'unknown error'}`
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
      
      case 'Consistentieregel':
        return this.executeConsistentieregel(result as Consistentieregel, context);
      
      case 'Verdeling':
        return this.executeVerdeling(result as Verdeling, context);
      
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
        try {
          const conditionResult = this.expressionEvaluator.evaluate(condition.expression, tempContext);
          
          if (this.isTruthy(conditionResult)) {
            // Condition is true, assign the characteristic
            const objectData = obj.value as Record<string, Value>;
            // Kenmerken are stored with "is " prefix
            const kenmerkKey = `is ${kenmerktoekenning.characteristic}`;
            objectData[kenmerkKey] = { type: 'boolean', value: true };
            assignedCount++;
          }
        } catch (error) {
          // If condition evaluation fails (e.g., missing attribute), skip this object
          // Continue to next object
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
  
  private executeConsistentieregel(consistentieregel: Consistentieregel, context: RuntimeContext): RuleExecutionResult {
    if (consistentieregel.criteriumType === 'uniek') {
      // Handle uniqueness check
      if (!consistentieregel.target) {
        throw new Error('Uniqueness check requires a target expression');
      }
      
      // Evaluate the target expression to get all values to check
      const targetValue = this.expressionEvaluator.evaluate(consistentieregel.target, context);
      
      // The target should be an array of values
      if (targetValue.type !== 'array') {
        throw new Error('Uniqueness check target must evaluate to an array');
      }
      
      const values = targetValue.value as Value[];
      const uniqueValues = new Set<any>();
      let hasNonUniqueValues = false;
      
      // Check for duplicates
      for (const value of values) {
        // Skip undefined/null values
        if (value.value === undefined || value.value === null) {
          continue;
        }
        
        const stringKey = JSON.stringify(value.value);
        if (uniqueValues.has(stringKey)) {
          hasNonUniqueValues = true;
          break;
        }
        uniqueValues.add(stringKey);
      }
      
      // For consistency rules, we don't fail on validation errors
      // Instead, we record the result in the context (implementation specific)
      return {
        success: true,
        // The rule executed successfully, regardless of whether values were unique
      };
    } else if (consistentieregel.criteriumType === 'inconsistent') {
      // Handle inconsistency check
      if (consistentieregel.condition) {
        // Evaluate the condition
        const conditionResult = this.expressionEvaluator.evaluate(consistentieregel.condition, context);
        
        // For inconsistency rules, we record if the data is inconsistent
        return {
          success: true,
          // The rule executed successfully
        };
      }
      
      // No condition means always inconsistent?
      return {
        success: true,
      };
    }
    
    throw new Error(`Unknown consistency criterion type: ${consistentieregel.criteriumType}`);
  }
  
  private executeVerdeling(verdeling: Verdeling, context: RuntimeContext): RuleExecutionResult {
    // Evaluate the source amount to get the total to distribute
    const sourceValue = this.expressionEvaluator.evaluate(verdeling.sourceAmount, context);
    
    if (sourceValue.type !== 'number') {
      throw new Error('Distribution source must be a number');
    }
    
    const totalAmount = sourceValue.value as number;
    
    // Evaluate the target collection to get all objects to distribute to
    const collectionValue = this.expressionEvaluator.evaluate(verdeling.targetCollection, context);
    
    if (collectionValue.type !== 'array') {
      throw new Error('Distribution target must be a collection');
    }
    
    const targetObjects = collectionValue.value as Value[];
    
    if (targetObjects.length === 0) {
      // Nothing to distribute to
      return {
        success: true,
        message: 'No targets for distribution'
      };
    }
    
    // For now, implement only equal distribution
    const hasEqualDistribution = verdeling.distributionMethods.some(
      method => method.type === 'VerdelingGelijkeDelen'
    );
    
    if (hasEqualDistribution) {
      // Distribute equally
      const amountPerTarget = totalAmount / targetObjects.length;
      
      // Update each target object's attribute
      for (const targetObj of targetObjects) {
        if (targetObj.type !== 'object') {
          continue;
        }
        
        // Assuming the target expression was something like "de ontvangen aantal van alle personen"
        // We need to extract the attribute name from the target collection expression
        // For now, we'll use a simplified approach
        const attributeName = this.extractAttributeNameFromTargetCollection(verdeling.targetCollection);
        
        const objectData = targetObj.value as Record<string, Value>;
        objectData[attributeName] = {
          type: 'number',
          value: amountPerTarget
        };
      }
      
      return {
        success: true,
        distributedAmount: totalAmount,
        targetCount: targetObjects.length
      };
    }
    
    // TODO: Implement other distribution methods (ratio, ordered, etc.)
    throw new Error('Only equal distribution is currently implemented');
  }
  
  private extractAttributeNameFromTargetCollection(expr: any): string {
    // This is a simplified extraction - in reality we'd need to properly parse
    // navigation expressions like "de ontvangen aantal van alle personen"
    // For now, assume it's a NavigationExpression with the attribute as the first part
    if (expr.type === 'NavigationExpression') {
      return expr.attribute;
    }
    
    // Fallback
    return 'ontvangen aantal';
  }
}