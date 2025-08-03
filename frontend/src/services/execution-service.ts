// Real execution service using the TypeScript engine
import { Engine } from '../lib/parser/bundles/engine.js';

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
      
      // The engine expects a context object with variables
      const context = {
        variables: new Map(Object.entries(testData))
      };
      
      // Execute the model
      const result = await this.engine.execute(model, context);
      
      console.log('Execution result:', result);
      
      // The engine might return the context directly or wrap it
      const executionContext = result.variables ? result : context;
      
      // Extract the output from the context
      const output: any = {};
      if (executionContext.variables instanceof Map) {
        executionContext.variables.forEach((value: any, key: string) => {
          output[key] = value;
        });
      } else {
        console.error('Unexpected context structure:', executionContext);
      }
      
      return {
        success: true,
        output,
        errors: [],
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