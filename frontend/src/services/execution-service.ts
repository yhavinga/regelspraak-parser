// Real execution service using the TypeScript engine
import { Engine, Context } from '../lib/parser/bundles/engine.js';

export interface ExecutionResult {
  success: boolean;
  output: any;
  errors: string[];
  executionTime: number;
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
        context.setVariable(key, value);
      });
      
      // Execute the model/AST
      const result = await this.engine.execute(model, context);
      
      console.log('Execution result:', result);
      
      // Extract the output from the context after execution
      const output: any = {};
      
      // Get all variables from the context's global scope
      context.scopes[0].forEach((value: any, key: string) => {
        output[key] = value;
      });
      
      // Also check if the result has a value
      if (result && result.success && result.value) {
        output._result = result.value;
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
}

export const executionService = new ExecutionService();