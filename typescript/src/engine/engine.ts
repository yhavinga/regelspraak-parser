import { IEngine, ParseResult, RuntimeContext, ExecutionResult, Value } from '../interfaces';
import { Context } from '../runtime/context';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import { RuleExecutor } from '../executors/rule-executor';
import { DecisionTableExecutor } from '../executors/decision-table-executor';
import { AntlrParser } from '../parsers/antlr-parser';
import { UnitSystemDefinition } from '../ast/unit-systems';
import { UnitRegistry } from '../units/unit-registry';
import { UnitSystem, BaseUnit } from '../units/base-unit';

/**
 * Main RegelSpraak engine
 */
export class Engine implements IEngine {
  private expressionEvaluator = new ExpressionEvaluator();
  private ruleExecutor = new RuleExecutor();
  private decisionTableExecutor = new DecisionTableExecutor();
  private antlrParser = new AntlrParser();
  private unitRegistry = new UnitRegistry();

  parse(source: string): ParseResult {
    const trimmed = source.trim();
    
    try {
      // Check if this contains multiple definitions (has newlines and multiple keywords)
      const lines = trimmed.split('\n');
      const definitionKeywords = ['Parameter ', 'Objecttype ', 'Regel ', 'Beslistabel ', 'Consistentieregel ', 'Verdeling ', 'Eenheidsysteem ', 'Dimensie ', 'Feittype ', 'Wederkerig feittype '];
      let definitionCount = 0;
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (definitionKeywords.some(kw => trimmedLine.startsWith(kw))) {
          definitionCount++;
          if (definitionCount >= 2) break;
        }
      }
      const hasMultipleDefinitions = definitionCount >= 2;
      
      if (hasMultipleDefinitions) {
        // Parse as a full document
        const definitions = this.antlrParser.parse(trimmed);
        
        // Wrap definitions in a Model object
        const rules = definitions.filter((def: any) => def.type === 'Rule');
        const objectTypes = definitions.filter((def: any) => def.type === 'ObjectTypeDefinition');
        const parameters = definitions.filter((def: any) => def.type === 'ParameterDefinition');
        const unitSystems = definitions.filter((def: any) => def.type === 'UnitSystemDefinition');
        const dimensions = definitions.filter((def: any) => def.type === 'Dimension');
        const feittypen = definitions.filter((def: any) => def.type === 'FeitType');
        
        return {
          success: true,
          ast: {
            type: 'Model',
            rules,
            objectTypes,
            parameters,
            unitSystems,
            dimensions,
            feittypen
          }
        };
      }
      
      // Check if this is a rule, object type, decision table, or just an expression
      if (trimmed.startsWith('Regel ')) {
        // Use ANTLR parser for rules
        const ast = this.antlrParser.parseRule(trimmed);
        return {
          success: true,
          ast
        };
      } else if (trimmed.startsWith('Objecttype ') || trimmed.startsWith('objecttype ')) {
        // Use ANTLR parser for object types
        const ast = this.antlrParser.parseObjectType(trimmed);
        return {
          success: true,
          ast
        };
      } else if (trimmed.startsWith('Parameter ')) {
        // Use ANTLR parser for parameters
        const ast = this.antlrParser.parseParameter(trimmed);
        return {
          success: true,
          ast
        };
      } else if (trimmed.startsWith('Beslistabel ')) {
        // Use ANTLR parser for decision tables
        const ast = this.antlrParser.parseDecisionTable(trimmed);
        return {
          success: true,
          ast
        };
      } else if (trimmed.startsWith('Eenheidsysteem ')) {
        // Parse as a full document to handle unit system definition
        const definitions = this.antlrParser.parse(trimmed);
        // Return the first (and should be only) definition
        return {
          success: true,
          ast: Array.isArray(definitions) && definitions.length > 0 ? definitions[0] : definitions
        };
      } else if (trimmed.startsWith('Dimensie ')) {
        // Parse as a full document to handle dimension definition
        const definitions = this.antlrParser.parse(trimmed);
        // Return the first (and should be only) definition
        return {
          success: true,
          ast: Array.isArray(definitions) && definitions.length > 0 ? definitions[0] : definitions
        };
      } else if (trimmed.startsWith('Feittype ') || trimmed.startsWith('Wederkerig feittype ')) {
        // Parse as a full document to handle feittype definition
        const definitions = this.antlrParser.parse(trimmed);
        // Return the first (and should be only) definition
        return {
          success: true,
          ast: Array.isArray(definitions) && definitions.length > 0 ? definitions[0] : definitions
        };
      } else {
        // Parse as expression using ANTLR
        const ast = this.antlrParser.parseExpression(trimmed);
        return {
          success: true,
          ast
        };
      }
    } catch (error) {
      return {
        success: false,
        errors: [{
          line: 1,
          column: 1,
          message: error instanceof Error ? error.message : 'Unknown parse error'
        }]
      };
    }
  }

  execute(ast: any, context: RuntimeContext): ExecutionResult {
    try {
      // Handle array of definitions
      if (Array.isArray(ast)) {
        let lastResult: ExecutionResult = {
          success: true,
          value: { type: 'null', value: null }
        };
        
        for (const definition of ast) {
          const result = this.execute(definition, context);
          if (!result.success) {
            return result; // Return first error
          }
          lastResult = result;
        }
        
        return lastResult;
      }
      
      // Handle different AST types
      // Check for DomainModel structure (no type field, but has regels, objectTypes, etc.)
      if (!ast.type && (ast.regels || ast.objectTypes || ast.parameters)) {
        // This is a DomainModel from the parser
        // Execute all rules in the model
        let lastResult: ExecutionResult = {
          success: true,
          value: { type: 'string', value: 'Model executed' }
        };
        
        // Execute each rule in sequence
        for (const rule of (ast.regels || [])) {
          const result = this.ruleExecutor.execute(rule, context);
          if (!result.success) {
            return {
              success: false,
              error: result.error
            };
          }
          // Keep track of the last result
          if (result.value) {
            lastResult = {
              success: true,
              value: result.value
            };
          }
        }
        
        return lastResult;
      } else if (ast.type === 'Model') {
        // First register any unit systems
        for (const unitSystem of (ast as any).unitSystems || []) {
          this.registerUnitSystem(unitSystem, context);
        }
        
        // Register all FeitTypes before executing rules
        for (const feittype of (ast as any).feittypen || []) {
          if (context.registerFeittype) {
            context.registerFeittype(feittype);
          }
        }
        
        // Execute all rules in the model
        let lastResult: ExecutionResult = {
          success: true,
          value: { type: 'string', value: 'Model executed' }
        };
        
        // Execute each rule in sequence
        for (const rule of (ast as any).rules || []) {
          const result = this.ruleExecutor.execute(rule, context);
          if (!result.success) {
            return {
              success: false,
              error: result.error
            };
          }
          // Keep track of the last result
          if (result.value) {
            lastResult = {
              success: true,
              value: result.value
            };
          }
        }
        
        return lastResult;
      } else if (ast.type === 'Rule') {
        const result = this.ruleExecutor.execute(ast, context);
        // Convert RuleExecutionResult to ExecutionResult
        if (result.success) {
          if (result.skipped) {
            // Rule was skipped due to condition
            return {
              success: true,
              value: {
                type: 'string',
                value: `Rule skipped: ${result.reason || 'condition not met'}`
              }
            };
          }
          return {
            success: true,
            value: result.value!
          };
        } else {
          return {
            success: false,
            error: result.error
          };
        }
      } else if (ast.type === 'DecisionTable') {
        return this.decisionTableExecutor.execute(ast, context);
      } else if (ast.type === 'ObjectTypeDefinition') {
        // For now, object type definitions don't execute - they just register
        // In a full implementation, this would register the type in the context
        return {
          success: true,
          value: { type: 'string', value: 'Object type registered' }
        };
      } else if (ast.type === 'ParameterDefinition') {
        // For now, parameter definitions don't execute - they just register
        // In a full implementation, this would register the parameter in the context
        return {
          success: true,
          value: { type: 'string', value: 'Parameter registered' }
        };
      } else if (ast.type === 'UnitSystemDefinition') {
        // Register the unit system in the context
        this.registerUnitSystem(ast, context);
        return {
          success: true,
          value: { type: 'string', value: `Unit system '${ast.name}' registered` }
        };
      } else if (ast.type === 'Dimension') {
        // For now, dimensions are just registered - they would be used during attribute access
        return {
          success: true,
          value: { type: 'string', value: `Dimension '${ast.name}' registered` }
        };
      } else if (ast.type === 'FeitType') {
        // Register the Feittype definition in the context
        (context as any).registerFeittype(ast);
        return {
          success: true,
          value: { type: 'string', value: `FeitType '${ast.naam}' registered` }
        };
      } else if (ast.type === 'RegelGroep') {
        // Execute rule group
        const result = this.ruleExecutor.executeRegelGroep(ast, context);
        if (result.success) {
          return {
            success: true,
            value: result.value!
          };
        } else {
          return {
            success: false,
            error: result.error
          };
        }
      } else {
        // It's an expression
        const value = this.expressionEvaluator.evaluate(ast, context);
        return {
          success: true,
          value
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown execution error')
      };
    }
  }

  run(source: string, context?: RuntimeContext): ExecutionResult {
    const parseResult = this.parse(source);
    if (!parseResult.success) {
      return {
        success: false,
        error: new Error(parseResult.errors![0].message)
      };
    }

    // Create or update context with the parsed model
    let ctx: RuntimeContext;
    if (context) {
      ctx = context;
      // If the parsed AST contains a model with dimensions, register them in the provided context
      const ast = parseResult.ast as any;
      if (ast && (ast.type === 'Model' || (!ast.type && (ast.dimensions || ast.objectTypes)))) {
        // Update the context's domain model and dimension registry
        const model = ast.type === 'Model' ? ast : ast;
        if (model.dimensions && ctx.dimensionRegistry) {
          // Register dimensions in the existing context
          for (const dimension of model.dimensions) {
            ctx.dimensionRegistry.register(dimension);
          }
        }
        // Also update the domain model reference
        if (!ctx.domainModel || ctx.domainModel.dimensions.length === 0) {
          ctx.domainModel = model;
        }
      }
    } else {
      // Create a new context with the parsed model if it's a DomainModel
      const ast = parseResult.ast as any;
      if (ast && (ast.type === 'Model' || (!ast.type && (ast.dimensions || ast.objectTypes)))) {
        const model = ast.type === 'Model' ? ast : ast;
        ctx = new Context(model);
      } else {
        ctx = new Context();
      }
    }

    return this.execute(parseResult.ast!, ctx);
  }

  evaluate(source: string, data?: Record<string, any>): ExecutionResult {
    const context = new Context();
    
    // Initialize context with provided data
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        // Convert JavaScript values to Value objects
        const valueObj = this.convertToValue(value);
        context.setVariable(key, valueObj);
      }
    }
    
    return this.run(source, context);
  }
  
  private convertToValue(value: any): Value {
    if (typeof value === 'number') {
      return { type: 'number', value };
    } else if (typeof value === 'string') {
      return { type: 'string', value };
    } else if (typeof value === 'boolean') {
      return { type: 'boolean', value };
    } else if (value instanceof Date) {
      return { type: 'date', value };
    } else if (value === null || value === undefined) {
      return { type: 'null', value: null };
    } else if (Array.isArray(value)) {
      return { type: 'list', value };
    } else {
      return { type: 'object', value };
    }
  }
  
  private registerUnitSystem(unitSystemDef: UnitSystemDefinition, context: RuntimeContext): void {
    // Create a new unit system
    const system = new UnitSystem(unitSystemDef.name);
    
    // First pass: add all units without conversions
    for (const unitDef of unitSystemDef.units) {
      const baseUnit: BaseUnit = {
        name: unitDef.name,
        plural: unitDef.plural,
        abbreviation: unitDef.abbreviation,
        symbol: unitDef.symbol
      };
      
      system.addUnit(baseUnit);
    }
    
    // Second pass: add conversion information, resolving abbreviations to full names
    for (const unitDef of unitSystemDef.units) {
      if (unitDef.conversion) {
        // Find the target unit by its identifier (which might be an abbreviation)
        const targetUnit = system.findUnit(unitDef.conversion.toUnit);
        if (targetUnit) {
          // Update the unit with conversion info using the full unit name
          const updatedUnit: BaseUnit = {
            name: unitDef.name,
            plural: unitDef.plural,
            abbreviation: unitDef.abbreviation,
            symbol: unitDef.symbol,
            conversionFactor: unitDef.conversion.factor,
            conversionToUnit: targetUnit.name  // Use the full name, not abbreviation
          };
          
          // Re-add the unit with conversion info
          system.addUnit(updatedUnit);
        }
      }
    }
    
    // Register the system in the unit registry
    this.unitRegistry.addSystem(system);
    
    // Also make the registry available in the context
    // This allows expression evaluator to access custom units
    (context as any).unitRegistry = this.unitRegistry;
  }
}