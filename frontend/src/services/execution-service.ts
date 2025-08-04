// Real execution service using the TypeScript engine
import { Engine, Context } from '../lib/parser/bundles/engine.js';

export interface ExecutionResult {
  success: boolean;
  output: any;
  errors: string[];
  executionTime: number;
}

export interface ExecutionTrace {
  executedRules: string[];
  skippedRules: SkippedRule[];
  conditionEvaluations: ConditionEvaluation[];
  duration: number;
}

export interface SkippedRule {
  ruleName: string;
  reason: 'invalid-scope' | 'condition-failed' | 'not-applicable';
  failedConditions: FailedCondition[];
}

export interface FailedCondition {
  text: string;
  expected: any;
  actual: any;
  path?: string;
}

export interface ConditionEvaluation {
  ruleName: string;
  conditionText: string;
  result: boolean;
  evaluatedValue?: any;
}

class ExecutionService {
  private engine = new Engine();

  async execute(model: any, testData: any): Promise<ExecutionResult> {
    const startTime = performance.now();
    
    try {
      console.log('Executing with model:', model);
      console.log('Test data:', testData);
      
      // Create a proper Context instance
      const context = new Context();
      
      // Initialize the context with test data
      Object.entries(testData).forEach(([key, value]) => {
        // Convert plain objects to proper Value types
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // This is an object - we need to register it in the object registry
          // First, try to determine the object type from the key
          // Common pattern: variable name often matches object type (e.g., persoon -> Persoon)
          const objectType = key.charAt(0).toUpperCase() + key.slice(1);
          
          // Generate an ID for this object
          const objectId = context.generateObjectId(objectType);
          
          // Convert object properties to Value types
          const attributes: Record<string, any> = {};
          for (const [attrKey, attrValue] of Object.entries(value)) {
            if (typeof attrValue === 'number') {
              attributes[attrKey] = { type: 'number', value: attrValue };
            } else if (typeof attrValue === 'string') {
              attributes[attrKey] = { type: 'string', value: attrValue };
            } else if (typeof attrValue === 'boolean') {
              attributes[attrKey] = { type: 'boolean', value: attrValue };
            } else {
              attributes[attrKey] = { type: 'object', value: attrValue };
            }
          }
          
          // Register the object in the context's object registry
          context.createObject(objectType, objectId, attributes);
          
          // Also set it as a variable for direct access
          const objectValue: any = {
            type: 'object',
            objectType: objectType,
            objectId: objectId,
            value: attributes
          };
          context.setVariable(key, objectValue);
        } else if (typeof value === 'number') {
          context.setVariable(key, { type: 'number', value: value });
        } else if (typeof value === 'string') {
          context.setVariable(key, { type: 'string', value: value });
        } else if (typeof value === 'boolean') {
          context.setVariable(key, { type: 'boolean', value: value });
        } else {
          // For other types, pass as-is
          context.setVariable(key, value);
        }
      });
      
      // Execute the model/AST
      console.log('Executing model with rules:', model.regels?.map((r: any) => ({
        name: r.naam,
        type: r.type,
        resultType: r.result?.type,
        hasCondition: !!r.condition
      })));
      const result = await this.engine.execute(model, context);
      
      console.log('Execution result:', result);
      console.log('Context after execution:', context);
      console.log('Context.scopes:', (context as any).scopes);
      console.log('Context.objects:', (context as any).objects);
      
      // Debug: Check what's actually in the scope
      if ((context as any).scopes && (context as any).scopes[0]) {
        console.log('Variables in scope:');
        (context as any).scopes[0].forEach((value: any, key: string) => {
          console.log(`  ${key}:`, value);
        });
      }
      
      // Extract the output from the context after execution
      const output: any = {};
      
      // Get all variables from the context
      // Note: Context stores regular variables in scopes[0] and objects in a separate objects Map
      const contextAny = context as any;
      
      // Get regular variables from global scope
      if (contextAny.scopes && contextAny.scopes[0]) {
        contextAny.scopes[0].forEach((value: any, key: string) => {
          // If it's a Value object, extract the actual value
          if (value && typeof value === 'object' && value.type && value.value !== undefined) {
            // This is a Value object
            if (value.type === 'object') {
              // For objects, the value is the actual object data
              output[key] = value.value;
            } else {
              // For primitives, just extract the value
              output[key] = value.value;
            }
          } else {
            // Not a Value object, use as-is
            output[key] = value;
          }
        });
      }
      
      // Get objects that were modified during execution
      if (contextAny.objects) {
        console.log('Checking objects in registry:');
        // For each object type in the registry
        contextAny.objects.forEach((typeMap: Map<string, any>, typeName: string) => {
          console.log(`  Type: ${typeName}, instances:`, typeMap.size);
          // For each object instance of that type
          typeMap.forEach((attributes: any, objectId: string) => {
            console.log(`    Object ${objectId} attributes:`, attributes);
            // Check if we have a variable pointing to this object
            contextAny.scopes[0].forEach((value: any, key: string) => {
              if (value && value.type === 'object' && 
                  value.objectType === typeName && 
                  value.objectId === objectId) {
                console.log(`    Found variable ${key} pointing to object ${objectId}`);
                // This variable points to this object - update the output with the object's current attributes
                const outputObj: any = {};
                
                // Convert the attributes back to plain values for output
                for (const [attrKey, attrValue] of Object.entries(attributes)) {
                  if (attrValue && typeof attrValue === 'object' && 
                      'type' in attrValue && 'value' in attrValue) {
                    // This is a Value object - extract the value
                    outputObj[attrKey] = attrValue.value;
                  } else {
                    outputObj[attrKey] = attrValue;
                  }
                }
                
                console.log(`    Output object for ${key}:`, outputObj);
                // Update the output with the modified object
                output[key] = outputObj;
              }
            });
          });
        });
      }
      
      // Also check if the result has a value
      if (result && result.success && result.value) {
        output._result = result.value;
      }
      
      // Add execution trace for debugging
      if (contextAny.getExecutionTrace) {
        const trace = contextAny.getExecutionTrace();
        if (trace && trace.length > 0) {
          output._trace = trace;
        }
      }
      
      return {
        success: result && result.success ? true : false,
        output,
        errors: result && result.error ? [result.error.toString()] : [],
        executionTime: performance.now() - startTime
      };
    } catch (error: any) {
      console.error('Execution error:', error);
      return {
        success: false,
        output: null,
        errors: [error.message || 'Unknown execution error'],
        executionTime: performance.now() - startTime
      };
    }
  }

  async executeWithTrace(model: any, testData: any): Promise<{ result: ExecutionResult; trace: ExecutionTrace }> {
    const startTime = performance.now();
    const trace: ExecutionTrace = {
      executedRules: [],
      skippedRules: [],
      conditionEvaluations: [],
      duration: 0
    };
    
    try {
      console.log('Executing with trace, model:', model);
      
      // Create a proper Context instance
      const context = new Context();
      
      // Initialize the context with test data (same as execute method)
      Object.entries(testData).forEach(([key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          const objectType = key.charAt(0).toUpperCase() + key.slice(1);
          const objectId = context.generateObjectId(objectType);
          const attributes: Record<string, any> = {};
          
          for (const [attrKey, attrValue] of Object.entries(value)) {
            if (typeof attrValue === 'number') {
              attributes[attrKey] = { type: 'number', value: attrValue };
            } else if (typeof attrValue === 'string') {
              attributes[attrKey] = { type: 'string', value: attrValue };
            } else if (typeof attrValue === 'boolean') {
              attributes[attrKey] = { type: 'boolean', value: attrValue };
            } else {
              attributes[attrKey] = { type: 'object', value: attrValue };
            }
          }
          
          context.createObject(objectType, objectId, attributes);
          const objectValue: any = {
            type: 'object',
            objectType: objectType,
            objectId: objectId,
            value: attributes
          };
          context.setVariable(key, objectValue);
        } else if (typeof value === 'number') {
          context.setVariable(key, { type: 'number', value: value });
        } else if (typeof value === 'string') {
          context.setVariable(key, { type: 'string', value: value });
        } else if (typeof value === 'boolean') {
          context.setVariable(key, { type: 'boolean', value: value });
        } else {
          context.setVariable(key, value);
        }
      });
      
      // Execute the model
      const result = await this.engine.execute(model, context);
      
      // Analyze trace from context
      const contextAny = context as any;
      if (contextAny.getExecutionTrace) {
        const rawTrace = contextAny.getExecutionTrace();
        console.log('Raw execution trace:', rawTrace);
        
        // Process the raw trace to extract rule execution information
        if (Array.isArray(rawTrace)) {
          rawTrace.forEach((traceItem: any) => {
            if (traceItem.type === 'rule_executed') {
              trace.executedRules.push(traceItem.ruleName);
            } else if (traceItem.type === 'rule_skipped') {
              trace.skippedRules.push({
                ruleName: traceItem.ruleName,
                reason: traceItem.reason || 'not-applicable',
                failedConditions: traceItem.failedConditions || []
              });
            } else if (traceItem.type === 'condition_evaluated') {
              trace.conditionEvaluations.push({
                ruleName: traceItem.ruleName,
                conditionText: traceItem.conditionText || '',
                result: traceItem.result,
                evaluatedValue: traceItem.evaluatedValue
              });
            }
          });
        }
      }
      
      // If we don't have trace info from context, analyze model rules
      if (trace.executedRules.length === 0 && trace.skippedRules.length === 0) {
        // Analyze model rules to provide basic trace info
        if (model.regels && Array.isArray(model.regels)) {
          model.regels.forEach((regel: any) => {
            // For now, assume all rules were evaluated
            // In a real implementation, the engine would provide this info
            const ruleName = regel.naam || 'Onbekende regel';
            
            // Simple heuristic: if we have output related to this rule, it executed
            const executed = contextAny.scopes?.[0]?.has(ruleName) || false;
            
            if (executed) {
              trace.executedRules.push(ruleName);
            } else if (regel.condition) {
              // If rule has condition and didn't execute, it was skipped
              trace.skippedRules.push({
                ruleName: ruleName,
                reason: 'condition-failed',
                failedConditions: [{
                  text: regel.condition.text || 'Voorwaarde niet voldaan',
                  expected: true,
                  actual: false
                }]
              });
            }
          });
        }
      }
      
      trace.duration = performance.now() - startTime;
      
      // Extract output (same as execute method)
      const output: any = {};
      
      if (contextAny.scopes && contextAny.scopes[0]) {
        contextAny.scopes[0].forEach((value: any, key: string) => {
          if (value && typeof value === 'object' && value.type && value.value !== undefined) {
            if (value.type === 'object') {
              output[key] = value.value;
            } else {
              output[key] = value.value;
            }
          } else {
            output[key] = value;
          }
        });
      }
      
      if (contextAny.objects) {
        contextAny.objects.forEach((typeMap: Map<string, any>, typeName: string) => {
          typeMap.forEach((attributes: any, objectId: string) => {
            contextAny.scopes[0].forEach((value: any, key: string) => {
              if (value && value.type === 'object' && 
                  value.objectType === typeName && 
                  value.objectId === objectId) {
                const outputObj: any = {};
                
                for (const [attrKey, attrValue] of Object.entries(attributes)) {
                  if (attrValue && typeof attrValue === 'object' && 
                      'type' in attrValue && 'value' in attrValue) {
                    outputObj[attrKey] = attrValue.value;
                  } else {
                    outputObj[attrKey] = attrValue;
                  }
                }
                
                output[key] = outputObj;
              }
            });
          });
        });
      }
      
      if (result && result.success && result.value) {
        output._result = result.value;
      }
      
      return {
        result: {
          success: result && result.success ? true : false,
          output,
          errors: result && result.error ? [result.error.toString()] : [],
          executionTime: trace.duration
        },
        trace
      };
    } catch (error: any) {
      console.error('Execution error:', error);
      trace.duration = performance.now() - startTime;
      
      return {
        result: {
          success: false,
          output: null,
          errors: [error.message || 'Unknown execution error'],
          executionTime: trace.duration
        },
        trace
      };
    }
  }
}

export const executionService = new ExecutionService();