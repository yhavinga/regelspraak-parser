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
  VerdelingAfronding,
  RegelGroep,
  FeitCreatie
} from '../ast/rules';
import { VariableReference, Expression } from '../ast/expressions';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import { Context } from '../runtime/context';
import { FeitExecutor } from './feit-executor';
import { resolveNavigationPath, isObjectScopedRule, setValueAtPath } from '../utils/navigation';

interface DistributionResult {
  amounts: number[];
  remainder: number;
}

/**
 * Executes RegelSpraak rules
 */
export class RuleExecutor implements IRuleExecutor {
  private expressionEvaluator = new ExpressionEvaluator();
  private feitExecutor = new FeitExecutor();

  execute(rule: Rule, context: RuntimeContext): RuleExecutionResult {
    try {
      const result = rule.result || rule.resultaat;
      if (!result) {
        return {
          success: false,
          error: new Error(`Rule '${rule.name || rule.naam}' has no result part`)
        };
      }
      
      // For Kenmerktoekenning rules with conditions, we handle the condition differently
      // The condition is evaluated per object, not at the rule level
      if (result.type === 'Kenmerktoekenning' && rule.condition) {
        return this.executeKenmerktoekenningWithCondition(
          result as Kenmerktoekenning, 
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
      
      // Mark rule as executed for regel status tracking
      const ctx = context as any;
      const ruleName = rule.name || rule.naam;
      if (ctx.markRuleExecuted && ruleName) {
        ctx.markRuleExecuted(ruleName);
      }
      
      // Set current rule name for consistency rule tracking
      ctx._currentRuleName = ruleName;
      
      // Special handling for inconsistent-type consistency rules
      if (result.type === 'Consistentieregel') {
        const consistentieregel = result as Consistentieregel;
        if (consistentieregel.criteriumType === 'inconsistent' && rule.condition) {
          // For inconsistent rules, condition being true means inconsistency was found
          if (ctx.markRuleInconsistent) {
            ctx.markRuleInconsistent(rule.name);
          }
        }
      }
      
      // Execute the result part(s)
      return this.executeResultPart(result, context);
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
      
      case 'FeitCreatie':
        return this.feitExecutor.executeFeitCreatie(result as FeitCreatie, context);
      
      default:
        throw new Error(`Unsupported result type: ${(result as any).type}`);
    }
  }
  
  private executeGelijkstelling(gelijkstelling: Gelijkstelling, context: RuntimeContext): RuleExecutionResult {
    // The target is an AttributeReference, NavigationExpression, or DimensionedAttributeReference
    if (!gelijkstelling.target) {
      throw new Error('No target in gelijkstelling');
    }
    
    let targetPath: string[];
    
    if ((gelijkstelling.target as any).type === 'DimensionedAttributeReference') {
      // For dimensional references, get the path from the base attribute
      const dimRef = gelijkstelling.target as any;
      if (!dimRef.baseAttribute || !dimRef.baseAttribute.path) {
        throw new Error('DimensionedAttributeReference must have baseAttribute with path');
      }
      targetPath = dimRef.baseAttribute.path;
    } else if (gelijkstelling.target.path) {
      // Regular AttributeReference
      targetPath = gelijkstelling.target.path;
    } else if ((gelijkstelling.target as any).type === 'NavigationExpression') {
      // NavigationExpression - extract path
      const navExpr = gelijkstelling.target as any;
      targetPath = this.extractPathFromNavigationExpression(navExpr);
    } else {
      throw new Error(`No path in gelijkstelling target. Target type: ${gelijkstelling.target.type}`);
    }
    
    if (targetPath.length === 0) {
      throw new Error('Empty target path in gelijkstelling');
    }
    
    // Check if this is an object-scoped rule
    if (isObjectScopedRule(targetPath)) {
      // With object-first order, the object type is the first element
      const objectType = targetPath[0];
      
      // Handle multi-word object types - "Natuurlijkpersoon" should match "Natuurlijk persoon"
      // Try exact match first
      let objects = (context as Context).getObjectsByType(objectType);
      
      // If no exact match, try variations
      if (objects.length === 0) {
        // Try common variations of multi-word object types
        const variations = [
          // Convert "Natuurlijkpersoon" to "Natuurlijk persoon"
          objectType.replace(/lijk(?=[A-Z])/g, 'lijk '),
          // Add space before capital letters
          objectType.replace(/([a-z])([A-Z])/g, '$1 $2'),
          // Handle specific case
          objectType === 'Natuurlijkpersoon' ? 'Natuurlijk persoon' : objectType
        ];
        
        for (const variant of variations) {
          if (variant !== objectType) {
            objects = (context as Context).getObjectsByType(variant);
            if (objects.length > 0) break;
          }
        }
      }
      
      if (objects.length > 0) {
        // Object-scoped rule - iterate over all objects of this type
        for (const obj of objects) {
          // Set current_instance for pronoun resolution
          const ctx = context as Context;
          const oldInstance = ctx.current_instance;
          ctx.current_instance = obj;
          
          try {
            // Evaluate expression in the context of this object
            const value = this.expressionEvaluator.evaluate(gelijkstelling.expression, context);
            
            // Navigate through the path to set the attribute
            // For "De vluchtdatum van de reis van een Natuurlijk persoon"
            // path = ["Natuurlijkpersoon", "reis", "vluchtdatum"] (object-first order)
            // Start from current object (Natuurlijk persoon) and navigate to reis (Vlucht)
            
            let currentObj = obj;
            // Navigate through intermediate segments (skip first=object type and last=attribute)
            for (let i = 1; i < targetPath.length - 1; i++) {
              const navSegment = targetPath[i];
              
              // First check if this is a Feittype role navigation
              let navigatedThroughFeittype = false;
              const feittypen = ctx.getAllFeittypen ? ctx.getAllFeittypen() : [];
              
              for (const feittype of feittypen) {
                for (let targetRoleIdx = 0; targetRoleIdx < (feittype.rollen || []).length; targetRoleIdx++) {
                  const targetRole = feittype.rollen[targetRoleIdx];
                  // Clean role name for comparison
                  const roleNameClean = targetRole.naam.toLowerCase().replace(/^(de|het|een)\s+/, '');
                  const segmentClean = navSegment.toLowerCase().replace(/^(de|het|een)\s+/, '');
                  
                  if (roleNameClean === segmentClean || 
                      (targetRole.meervoud && targetRole.meervoud.toLowerCase() === segmentClean)) {
                    // Found the target role we want to navigate to
                    // Now find which other role matches our current object
                    const currentObjType = (currentObj as any).objectType || currentObj.type;
                    
                    // Find the role that matches the current object type
                    for (let sourceRoleIdx = 0; sourceRoleIdx < feittype.rollen.length; sourceRoleIdx++) {
                      if (sourceRoleIdx === targetRoleIdx) continue; // Skip the target role
                      
                      const sourceRole = feittype.rollen[sourceRoleIdx];
                      if (sourceRole.objectType === currentObjType) {
                        // Current object matches this source role
                        // Navigate from source to target role
                        // If source is at index 0, it's the subject
                        const asSubject = (sourceRoleIdx === 0);
                        const relatedObjects = ctx.getRelatedObjects(currentObj, feittype.naam, asSubject);
                        
                        if (relatedObjects && relatedObjects.length > 0) {
                          currentObj = relatedObjects[0];
                          navigatedThroughFeittype = true;
                          break;
                        }
                      }
                    }
                  }
                  if (navigatedThroughFeittype) break;
                }
                if (navigatedThroughFeittype) break;
              }
              
              if (!navigatedThroughFeittype) {
                // Try as a direct attribute
                const objData = currentObj.value as Record<string, Value>;
                const nextObj = objData[navSegment];
                
                if (!nextObj || nextObj.type !== 'object') {
                  // Can't navigate further - skip this object
                  currentObj = null as any;
                  break;
                }
                currentObj = nextObj;
              }
            }
            
            if (currentObj) {
              // Set the attribute on the final object (last element in path)
              const attributeName = targetPath[targetPath.length - 1];
              const objData = currentObj.value as Record<string, Value>;
              objData[attributeName] = value;
              // Successfully set the attribute
            } else {
              // Navigation failed - skip this object
            }
          } finally {
            ctx.current_instance = oldInstance;
          }
        }
        
        return {
          success: true,
          target: targetPath.join('.'),
          value: { type: 'string', value: `Set on all ${objects.length} ${objectType} objects` }
        };
      }
    }
    
    // Not an object-scoped rule - evaluate the expression once
    const value = this.expressionEvaluator.evaluate(gelijkstelling.expression, context);
    
    if (targetPath.length === 1) {
      // Simple attribute name - likely a variable assignment
      context.setVariable(targetPath[0], value);
      return {
        success: true,
        target: targetPath.join('.'),
        value
      };
    } else if (targetPath.length === 2) {
      // Pattern like ["berekening", "resultaat"] - object-first order
      const objectName = targetPath[0];
      const attributeName = targetPath[1];
      
      // First, try to get the object as a variable
      const objectValue = context.getVariable(objectName);
      
      if (objectValue && objectValue.type === 'object') {
        // Set the attribute on the specific object
        const objectData = objectValue.value as Record<string, Value>;
        objectData[attributeName] = value;
      } else {
        // Fall back to getting all objects of this type
        const objects = (context as Context).getObjectsByType(objectName);
        
        // Set attribute on all objects of this type
        for (const obj of objects) {
          if (obj.type === 'object') {
            const objectData = obj.value as Record<string, Value>;
            objectData[attributeName] = value;
          }
        }
      }
      return {
        success: true,
        target: targetPath.join('.'),
        value
      };
    } else {
      // Complex path - use navigation resolver
      const result = setValueAtPath(targetPath, value, context);
      
      if (!result.success) {
        throw new Error(`Failed to set value at path ${targetPath.join('.')}: ${result.error}`);
      }
      
      return {
        success: true,
        target: targetPath.join('.'),
        value
      };
    }
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
        // Also set current_instance for pronoun resolution (self/zijn/haar)
        (tempContext as any).current_instance = obj;
        
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
          // Mark rule as inconsistent for regel status tracking
          const ctx = context as any;
          if (ctx.markRuleInconsistent && ctx._currentRuleName) {
            ctx.markRuleInconsistent(ctx._currentRuleName);
          }
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
    
    // Parse the target collection to extract objects and attribute
    // Pattern: "de <attribute> van <collection>"
    let targetObjects: Value[] = [];
    let attributeName: string = '';
    
    if (verdeling.targetCollection.type === 'NavigationExpression') {
      const navExpr = verdeling.targetCollection as any;
      attributeName = navExpr.attribute;
      
      // Evaluate the object part to get the collection
      const objectValue = this.expressionEvaluator.evaluate(navExpr.object, context);
      
      if (objectValue.type === 'array') {
        targetObjects = objectValue.value as Value[];
      } else {
        throw new Error('Distribution target collection must evaluate to an array');
      }
    } else if (verdeling.targetCollection.type === 'AttributeReference') {
      const attrRef = verdeling.targetCollection as any;
      
      // For AttributeReference with path like ["personen", "ontvangen aantal"]
      // With object-first order: first is collection, second is attribute
      if (attrRef.path.length === 2) {
        const collectionName = attrRef.path[0];
        attributeName = attrRef.path[1];
        
        // Look up the collection as a variable
        const collectionValue = this.expressionEvaluator.evaluate({
          type: 'VariableReference',
          variableName: collectionName
        } as VariableReference, context);
        
        if (collectionValue.type === 'array') {
          targetObjects = collectionValue.value as Value[];
        } else {
          throw new Error('Distribution target collection must evaluate to an array');
        }
      } else {
        throw new Error('Distribution target AttributeReference must have exactly 2 path elements');
      }
    } else {
      throw new Error('Distribution target must be a navigation expression or attribute reference');
    }
    
    if (targetObjects.length === 0) {
      // Nothing to distribute to
      // Handle remainder if specified
      if (verdeling.remainderTarget) {
        this.setRemainderValue(verdeling.remainderTarget, sourceValue, context);
      }
      return {
        success: true
        // No targets for distribution
      };
    }
    
    // Calculate distribution based on methods
    const distributionResult = this.calculateDistribution(
      totalAmount,
      targetObjects,
      verdeling.distributionMethods,
      context
    );
    
    // Apply distributed values to target objects
    for (let i = 0; i < targetObjects.length; i++) {
      const targetObj = targetObjects[i];
      if (!targetObj || targetObj.type !== 'object') {
        continue;
      }
      
      const objectData = targetObj.value as Record<string, Value>;
      objectData[attributeName] = {
        type: 'number',
        value: distributionResult.amounts[i]
      };
    }
    
    // Handle remainder if specified
    if (verdeling.remainderTarget && distributionResult.remainder > 0) {
      const remainderValue: Value = {
        type: 'number',
        value: distributionResult.remainder
      };
      this.setRemainderValue(verdeling.remainderTarget, remainderValue, context);
    }
    
    return {
      success: true
      // Distributed totalAmount to targetObjects.length targets
    };
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
  
  private setRemainderValue(remainderTarget: Expression, value: Value, context: RuntimeContext): void {
    // The remainder target should be an attribute reference on the current instance
    if (remainderTarget.type === 'AttributeReference') {
      const attrRef = remainderTarget as any;
      if (attrRef.path && attrRef.path.length > 0) {
        // With object-first order, attribute is the last element
        const attrName = attrRef.path[attrRef.path.length - 1];
        // Set on current instance or specified object
        const ctx = context as Context;
        if (ctx.current_instance) {
          const objectData = ctx.current_instance.value as Record<string, Value>;
          objectData[attrName] = value;
        }
      }
    } else if (remainderTarget.type === 'NavigationExpression') {
      // Handle navigation expression for remainder target
      const navExpr = remainderTarget as any;
      const attrName = navExpr.attribute;
      const objectExpr = navExpr.object;
      
      // Evaluate the object expression to get the target object
      const targetObject = this.expressionEvaluator.evaluate(objectExpr, context);
      
      if (targetObject.type === 'object') {
        const objectData = targetObject.value as Record<string, Value>;
        objectData[attrName] = value;
      }
    }
  }
  
  private calculateDistribution(
    totalAmount: number,
    targetObjects: Value[],
    methods: VerdelingMethode[],
    context: RuntimeContext
  ): DistributionResult {
    const n = targetObjects.length;
    if (n === 0) {
      return { amounts: [], remainder: totalAmount };
    }
    
    // Start with equal distribution as default
    let amounts = new Array(n).fill(totalAmount / n);
    let hasRatio = false;
    let hasOrdering = false;
    let hasMaximum = false;
    let hasRounding = false;
    
    // Extract all method configurations
    let ratioExpression: Expression | undefined;
    let orderExpression: Expression | undefined;
    let orderDirection: 'toenemende' | 'afnemende' | undefined;
    let tieBreakMethod: VerdelingMethode | undefined;
    let maximumExpression: Expression | undefined;
    let roundingDecimals: number | undefined;
    let roundingDirection: string | undefined;
    
    // Process methods to extract configurations
    for (const method of methods) {
      switch (method.type) {
        case 'VerdelingGelijkeDelen':
          // Equal distribution is the default
          break;
          
        case 'VerdelingNaarRato':
          hasRatio = true;
          ratioExpression = (method as VerdelingNaarRato).ratioExpression;
          break;
          
        case 'VerdelingOpVolgorde':
          hasOrdering = true;
          const orderMethod = method as VerdelingOpVolgorde;
          orderExpression = orderMethod.orderExpression;
          orderDirection = orderMethod.orderDirection as 'toenemende' | 'afnemende';
          break;
          
        case 'VerdelingTieBreak':
          tieBreakMethod = (method as VerdelingTieBreak).tieBreakMethod;
          break;
          
        case 'VerdelingMaximum':
          hasMaximum = true;
          maximumExpression = (method as VerdelingMaximum).maxExpression;
          break;
          
        case 'VerdelingAfronding':
          hasRounding = true;
          const roundingMethod = method as VerdelingAfronding;
          roundingDecimals = roundingMethod.decimals;
          roundingDirection = roundingMethod.roundDirection;
          break;
      }
    }
    
    // Apply distribution logic based on methods
    if (hasOrdering && orderExpression) {
      // Sort objects and apply ordered distribution
      amounts = this.distributeOrdered(
        totalAmount,
        targetObjects,
        orderExpression,
        orderDirection!,
        tieBreakMethod,
        maximumExpression,
        context
      );
    } else if (hasRatio && ratioExpression) {
      // Apply ratio-based distribution
      amounts = this.distributeByRatio(
        totalAmount,
        targetObjects,
        ratioExpression,
        context
      );
    }
    
    // Apply maximum constraint if specified
    if (hasMaximum && maximumExpression) {
      amounts = this.applyMaximumConstraint(
        amounts,
        targetObjects,
        maximumExpression,
        context
      );
    }
    
    // Apply rounding if specified
    if (hasRounding && roundingDecimals !== undefined) {
      amounts = this.applyRounding(
        amounts,
        roundingDecimals,
        roundingDirection === 'naar beneden'
      );
    }
    
    // Calculate remainder
    const distributedTotal = amounts.reduce((sum, amt) => sum + amt, 0);
    const remainder = totalAmount - distributedTotal;
    
    return { amounts, remainder };
  }
  
  private distributeByRatio(
    totalAmount: number,
    targetObjects: Value[],
    ratioExpression: Expression,
    context: RuntimeContext
  ): number[] {
    // Evaluate ratio expression for each target object
    const ratios: number[] = [];
    let totalRatio = 0;
    
    for (const targetObj of targetObjects) {
      if (targetObj.type !== 'object') {
        ratios.push(0);
        continue;
      }
      
      // Temporarily set this object as current for expression evaluation
      const ctx = context as Context;
      const oldInstance = ctx.current_instance;
      ctx.current_instance = targetObj;
      
      try {
        const ratioValue = this.expressionEvaluator.evaluate(ratioExpression, context);
        if (ratioValue.type === 'number') {
          const ratio = ratioValue.value as number;
          ratios.push(ratio);
          totalRatio += ratio;
        } else {
          ratios.push(0);
        }
      } finally {
        ctx.current_instance = oldInstance;
      }
    }
    
    // Calculate amounts based on ratios
    if (totalRatio === 0) {
      // If all ratios are 0, distribute equally
      return new Array(targetObjects.length).fill(totalAmount / targetObjects.length);
    }
    
    return ratios.map(ratio => (ratio / totalRatio) * totalAmount);
  }
  
  private distributeOrdered(
    totalAmount: number,
    targetObjects: Value[],
    orderExpression: Expression,
    orderDirection: 'toenemende' | 'afnemende',
    tieBreakMethod: VerdelingMethode | undefined,
    maximumExpression: Expression | undefined,
    context: RuntimeContext
  ): number[] {
    // Create array of objects with their order values
    const objectsWithOrder: Array<{obj: Value, orderValue: any, index: number}> = [];
    
    for (let i = 0; i < targetObjects.length; i++) {
      const targetObj = targetObjects[i];
      if (targetObj.type !== 'object') {
        objectsWithOrder.push({obj: targetObj, orderValue: 0, index: i});
        continue;
      }
      
      // Evaluate order expression for this object
      const ctx = context as Context;
      const oldInstance = ctx.current_instance;
      ctx.current_instance = targetObj;
      
      try {
        const orderValue = this.expressionEvaluator.evaluate(orderExpression, context);
        objectsWithOrder.push({
          obj: targetObj,
          orderValue: orderValue.value,
          index: i
        });
      } finally {
        ctx.current_instance = oldInstance;
      }
    }
    
    // Sort by order value
    objectsWithOrder.sort((a, b) => {
      const comparison = a.orderValue < b.orderValue ? -1 : 
                        a.orderValue > b.orderValue ? 1 : 0;
      return orderDirection === 'toenemende' ? comparison : -comparison;
    });
    
    // Distribute in order, respecting maximum if specified
    const amounts = new Array(targetObjects.length).fill(0);
    let remainingAmount = totalAmount;
    
    // Group by order value for tie-breaking
    const groups: Array<Array<{obj: Value, index: number}>> = [];
    let currentGroup: Array<{obj: Value, index: number}> = [];
    let lastOrderValue: any = null;
    
    for (const item of objectsWithOrder) {
      if (lastOrderValue !== null && item.orderValue !== lastOrderValue) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      }
      currentGroup.push({obj: item.obj, index: item.index});
      lastOrderValue = item.orderValue;
    }
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    // Distribute to each group
    for (const group of groups) {
      if (remainingAmount <= 0) break;
      
      // For tied objects, distribute based on tie-break method
      if (group.length === 1) {
        // No tie, give all remaining (respecting maximum)
        const index = group[0].index;
        let amount = remainingAmount;
        
        // Apply maximum if specified
        if (maximumExpression) {
          const ctx = context as Context;
          const oldInstance = ctx.current_instance;
          ctx.current_instance = group[0].obj;
          
          try {
            const maxValue = this.expressionEvaluator.evaluate(maximumExpression, context);
            if (maxValue.type === 'number') {
              amount = Math.min(amount, maxValue.value as number);
            }
          } finally {
            ctx.current_instance = oldInstance;
          }
        }
        
        amounts[index] = amount;
        remainingAmount -= amount;
      } else {
        // Tie - distribute within group based on tie-break method
        if (tieBreakMethod) {
          if (tieBreakMethod.type === 'VerdelingGelijkeDelen') {
            // Equal distribution within group
            const amountPerObject = remainingAmount / group.length;
            for (const {obj, index} of group) {
              let amount = amountPerObject;
              
              // Apply maximum if specified
              if (maximumExpression) {
                const ctx = context as Context;
                const oldInstance = ctx.current_instance;
                ctx.current_instance = obj;
                
                try {
                  const maxValue = this.expressionEvaluator.evaluate(maximumExpression, context);
                  if (maxValue.type === 'number') {
                    amount = Math.min(amount, maxValue.value as number);
                  }
                } finally {
                  ctx.current_instance = oldInstance;
                }
              }
              
              amounts[index] = amount;
              remainingAmount -= amount;
            }
          } else if (tieBreakMethod.type === 'VerdelingNaarRato') {
            // Ratio-based distribution within group
            const tieBreakExpression = (tieBreakMethod as VerdelingNaarRato).ratioExpression;
            const groupObjects = group.map(g => g.obj);
            const groupAmounts = this.distributeByRatio(
              remainingAmount,
              groupObjects,
              tieBreakExpression,
              context
            );
            
            // Apply amounts with maximum constraint
            for (let i = 0; i < group.length; i++) {
              let amount = groupAmounts[i];
              
              // Apply maximum if specified
              if (maximumExpression) {
                const ctx = context as Context;
                const oldInstance = ctx.current_instance;
                ctx.current_instance = group[i].obj;
                
                try {
                  const maxValue = this.expressionEvaluator.evaluate(maximumExpression, context);
                  if (maxValue.type === 'number') {
                    amount = Math.min(amount, maxValue.value as number);
                  }
                } finally {
                  ctx.current_instance = oldInstance;
                }
              }
              
              amounts[group[i].index] = amount;
              remainingAmount -= amount;
            }
          }
        } else {
          // No tie-break method specified, distribute equally
          const amountPerObject = remainingAmount / group.length;
          for (const {obj, index} of group) {
            amounts[index] = amountPerObject;
            remainingAmount -= amountPerObject;
          }
        }
      }
    }
    
    return amounts;
  }
  
  private applyMaximumConstraint(
    amounts: number[],
    targetObjects: Value[],
    maximumExpression: Expression,
    context: RuntimeContext
  ): number[] {
    const newAmounts: number[] = [];
    
    for (let i = 0; i < amounts.length; i++) {
      const targetObj = targetObjects[i];
      if (targetObj.type !== 'object') {
        newAmounts.push(amounts[i]);
        continue;
      }
      
      // Evaluate maximum for this object
      const ctx = context as Context;
      const oldInstance = ctx.current_instance;
      ctx.current_instance = targetObj;
      
      try {
        const maxValue = this.expressionEvaluator.evaluate(maximumExpression, context);
        if (maxValue.type === 'number') {
          newAmounts.push(Math.min(amounts[i], maxValue.value as number));
        } else {
          newAmounts.push(amounts[i]);
        }
      } finally {
        ctx.current_instance = oldInstance;
      }
    }
    
    return newAmounts;
  }
  
  private applyRounding(
    amounts: number[],
    decimals: number,
    roundDown: boolean
  ): number[] {
    const factor = Math.pow(10, decimals);
    
    return amounts.map(amount => {
      if (roundDown) {
        return Math.floor(amount * factor) / factor;
      } else {
        return Math.ceil(amount * factor) / factor;
      }
    });
  }
  
  private extractPathFromNavigationExpression(navExpr: any): string[] {
    // NavigationExpression has structure: { attribute: string, object: Expression }
    // We need to build a path from the navigation chain
    // Dutch right-to-left navigation: object-first order
    const pathReversed: string[] = [];
    
    // Start with the attribute (will be last in final path)
    pathReversed.push(navExpr.attribute);
    
    // Traverse the object chain
    let current = navExpr.object;
    while (current) {
      if (current.type === 'NavigationExpression') {
        // Another navigation expression - add its attribute
        pathReversed.push(current.attribute);
        current = current.object;
      } else if (current.type === 'VariableReference') {
        // End of chain - this should be the object type
        pathReversed.push(current.variableName);
        break;
      } else {
        // Unknown expression type in navigation chain
        break;
      }
    }
    
    // Reverse to get object-first order
    return pathReversed.reverse();
  }
  
  executeRegelGroep(regelGroep: RegelGroep, context: RuntimeContext): RuleExecutionResult {
    const results: any[] = [];
    
    if (!regelGroep.isRecursive) {
      // Non-recursive: execute all rules once
      for (const rule of regelGroep.rules) {
        try {
          const result = this.execute(rule, context);
          results.push({
            rule: rule.name,
            status: result.success ? 'evaluated' : 'error',
            result: result
          });
        } catch (error) {
          results.push({
            rule: rule.name,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    } else {
      // Recursive: execute with iteration tracking
      const maxIterations = 100; // Safety limit
      let iteration = 0;
      
      while (iteration < maxIterations) {
        iteration++;
        let objectCreated = false;
        
        for (const rule of regelGroep.rules) {
          // Check if this is an object creation rule
          const result = rule.result || rule.resultaat;
          if (result && result.type === 'ObjectCreation') {
            // Check termination condition
            if (rule.condition) {
              try {
                const conditionResult = this.expressionEvaluator.evaluate(rule.condition.expression, context);
                if (!this.isTruthy(conditionResult)) {
                  // Termination condition met
                  results.push({
                    iteration,
                    rule: rule.name,
                    status: 'terminated',
                    message: 'Termination condition met'
                  });
                  return {
                    success: true,
                    value: { type: 'array', value: results }
                  };
                }
              } catch (error) {
                // Condition evaluation failed - treat as termination
                results.push({
                  iteration,
                  rule: rule.name,
                  status: 'terminated',
                  message: `Condition evaluation failed: ${error instanceof Error ? error.message : 'unknown'}`
                });
                return {
                  success: true,
                  value: { type: 'array', value: results }
                };
              }
            }
            
            // Execute object creation
            const result = this.execute(rule, context);
            if (result.success) {
              objectCreated = true;
              results.push({
                iteration,
                rule: rule.name,
                status: 'object_created',
                result
              });
            }
          } else {
            // Execute other rules normally
            const result = this.execute(rule, context);
            results.push({
              iteration,
              rule: rule.name,
              status: result.success ? 'evaluated' : 'error',
              result
            });
          }
        }
        
        // If no objects were created, terminate
        if (!objectCreated) {
          results.push({
            iteration,
            status: 'completed',
            message: 'No more objects created'
          });
          break;
        }
      }
      
      // Check if we hit max iterations
      if (iteration >= maxIterations) {
        results.push({
          iteration,
          status: 'max_iterations_reached',
          message: `Maximum iterations (${maxIterations}) reached`
        });
      }
    }
    
    return {
      success: true,
      value: { type: 'array', value: results }
    };
  }
}