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
      const definitionKeywords = ['Parameter ', 'Objecttype ', 'Regel ', 'Beslistabel ', 'Consistentieregel ', 'Verdeling ', 'Eenheidsysteem ', 'Dimensie ', 'Feittype ', 'Wederkerig feittype ', 'Regelgroep '];
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
        const regelGroepen = definitions.filter((def: any) => def.type === 'RegelGroep');

        return {
          success: true,
          ast: {
            type: 'Model',
            rules,
            objectTypes,
            parameters,
            unitSystems,
            dimensions,
            feittypen,
            regelGroepen
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
      } else if (trimmed.startsWith('Regelgroep ')) {
        // Parse as a full document to handle regelgroep definition
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

  /**
   * Parse a complete RegelSpraak model (may contain multiple definitions).
   * This is a convenience method that wraps the ANTLR parser's parseModel.
   * @param source The RegelSpraak source code
   * @returns Parse result with model AST
   */
  parseModel(source: string): {
    success: boolean;
    model?: any;
    errors?: string[];
  } {
    try {
      const model = this.antlrParser.parseModel(source);
      return {
        success: true,
        model
      };
    } catch (error) {
      return {
        success: false,
        errors: [(error as Error).message]
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

      // Check for DomainModel structure (no type field, but has regels, objectTypes, etc.)
      if (!ast.type && (ast.regels || ast.objectTypes || ast.parameters)) {
        // This is a DomainModel from the parser

        // First register any unit systems
        for (const unitSystem of (ast.unitSystems || [])) {
          this.registerUnitSystem(unitSystem, context);
        }

        // Register all FeitTypes before executing rules
        for (const feittype of (ast.feitTypes || [])) {
          if ((context as any).registerFeittype) {
            (context as any).registerFeittype(feittype);
          }
        }

        let lastResult: ExecutionResult = {
          success: true,
          value: { type: 'string', value: 'Model executed' }
        };

        // Get beslistabels from the model
        const beslistabels = ast.beslistabels || [];

        // ============================================================
        // Phase 1: Execute decision tables that provide lookup values
        // ============================================================
        for (const beslistabel of beslistabels) {
          const targetType = this.deduceBeslistabelTargetType(beslistabel, context);
          if (!targetType) continue;

          const instances = (context as any).getObjectsByType(targetType);
          for (const instance of instances) {
            const previousInstance = (context as any).current_instance;
            (context as any).current_instance = instance;
            try {
              this.decisionTableExecutor.execute(beslistabel, context);
            } catch (e) {
              // Silently continue - table may depend on rule output
            } finally {
              (context as any).current_instance = previousInstance;
            }
          }
        }

        // ============================================================
        // Phase 2: Execute all rules in sequence
        // ============================================================
        for (const rule of (ast.regels || [])) {
          // Deduce target type for rule (central deduction matching Python)
          const targetType = this.deduceRuleTargetType(rule, context);

          if (!targetType) {
            // Rule doesn't target specific object type - execute directly
            const result = this.ruleExecutor.execute(rule, context);
            if (!result.success) {
              return { success: false, error: result.error };
            }
            if (result.value) {
              lastResult = { success: true, value: result.value };
            }
            continue;
          }

          // Iterate over all instances of target type
          const instances = (context as any).getObjectsByType(targetType);
          for (const instance of instances) {
            const previousInstance = (context as any).current_instance;
            (context as any).current_instance = instance;
            try {
              // Evaluate condition if present
              const voorwaarde = rule.voorwaarde || rule.condition;
              if (voorwaarde) {
                const expression = voorwaarde.expression || voorwaarde.expressie;
                if (expression) {
                  const conditionResult = this.expressionEvaluator.evaluate(expression, context);
                  if (conditionResult.type !== 'boolean' || !conditionResult.value) {
                    continue; // Condition not met - skip this instance
                  }
                }
              }

              // Execute rule for this instance
              const result = this.ruleExecutor.execute(rule, context);
              if (!result.success) {
                return { success: false, error: result.error };
              }
              if (result.value) {
                lastResult = { success: true, value: result.value };
              }
            } catch (e) {
              console.warn(`Rule '${rule.name || rule.naam}' failed for ${targetType} instance: ${e}`);
            } finally {
              (context as any).current_instance = previousInstance;
            }
          }
        }

        // ============================================================
        // Phase 3: Re-execute decision tables that depend on rule outputs
        // ============================================================
        for (const beslistabel of beslistabels) {
          const targetType = this.deduceBeslistabelTargetType(beslistabel, context);
          if (!targetType) continue;

          const instances = (context as any).getObjectsByType(targetType);
          for (const instance of instances) {
            const previousInstance = (context as any).current_instance;
            (context as any).current_instance = instance;
            try {
              this.decisionTableExecutor.execute(beslistabel, context);
            } catch (e) {
              console.warn(`Decision table phase 3 error for ${beslistabel.naam}: ${e}`);
            } finally {
              (context as any).current_instance = previousInstance;
            }
          }
        }

        // ============================================================
        // Phase 4: Re-run Gelijkstelling rules that depend on decision tables
        // ============================================================
        for (const rule of (ast.regels || [])) {
          // Support both result (English from parseModel) and resultaat (Dutch) property names
          const resultType = rule.result?.type || rule.resultaat?.type;
          if (resultType !== 'Gelijkstelling') continue;

          const targetType = this.deduceRuleTargetType(rule, context);
          if (!targetType) {
            // No target type - execute directly
            const result = this.ruleExecutor.execute(rule, context);
            if (result.success && result.value) {
              lastResult = { success: true, value: result.value };
            }
            continue;
          }

          // Iterate over all instances of target type
          const instances = (context as any).getObjectsByType(targetType);
          for (const instance of instances) {
            const previousInstance = (context as any).current_instance;
            (context as any).current_instance = instance;
            try {
              const result = this.ruleExecutor.execute(rule, context);
              if (result.success && result.value) {
                lastResult = { success: true, value: result.value };
              }
            } finally {
              (context as any).current_instance = previousInstance;
            }
          }
        }

        // Execute each regelgroep in sequence
        for (const regelGroep of (ast.regelGroepen || [])) {
          const result = this.ruleExecutor.executeRegelGroep(regelGroep, context);
          if (!result.success) {
            return {
              success: false,
              error: result.error
            };
          }
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

        let lastResult: ExecutionResult = {
          success: true,
          value: { type: 'string', value: 'Model executed' }
        };

        // Get beslistabels from the model (handle both naming conventions)
        const beslistabels = (ast as any).beslistabels || (ast as any).decisionTables || [];

        // ============================================================
        // Phase 1: Execute decision tables that provide lookup values
        // (e.g., "Woonregio factor" which maps province to region)
        // ============================================================
        for (const beslistabel of beslistabels) {
          const targetType = this.deduceBeslistabelTargetType(beslistabel, context);
          if (!targetType) continue;

          const instances = (context as any).getObjectsByType(targetType);
          for (const instance of instances) {
            const previousInstance = (context as any).current_instance;
            (context as any).current_instance = instance;
            try {
              this.decisionTableExecutor.execute(beslistabel, context);
            } catch (e) {
              // Silently continue - table may depend on rule output computed in Phase 3
            } finally {
              (context as any).current_instance = previousInstance;
            }
          }
        }

        // ============================================================
        // Phase 2: Execute all rules in sequence
        // ============================================================
        for (const rule of (ast as any).rules || []) {
          // Deduce target type for rule (central deduction matching Python)
          const targetType = this.deduceRuleTargetType(rule, context);

          if (!targetType) {
            // Rule doesn't target specific object type - execute directly
            const result = this.ruleExecutor.execute(rule, context);
            if (!result.success) {
              return { success: false, error: result.error };
            }
            if (result.value) {
              lastResult = { success: true, value: result.value };
            }
            continue;
          }

          // Iterate over all instances of target type
          const instances = (context as any).getObjectsByType(targetType);
          for (const instance of instances) {
            const previousInstance = (context as any).current_instance;
            (context as any).current_instance = instance;
            try {
              // Evaluate condition if present
              const voorwaarde = rule.voorwaarde || rule.condition;
              if (voorwaarde) {
                const expression = voorwaarde.expression || voorwaarde.expressie;
                if (expression) {
                  const conditionResult = this.expressionEvaluator.evaluate(expression, context);
                  if (conditionResult.type !== 'boolean' || !conditionResult.value) {
                    continue; // Condition not met - skip this instance
                  }
                }
              }

              // Execute rule for this instance
              const result = this.ruleExecutor.execute(rule, context);
              if (!result.success) {
                return { success: false, error: result.error };
              }
              if (result.value) {
                lastResult = { success: true, value: result.value };
              }
            } catch (e) {
              console.warn(`Rule '${rule.name || rule.naam}' failed for ${targetType} instance: ${e}`);
            } finally {
              (context as any).current_instance = previousInstance;
            }
          }
        }

        // ============================================================
        // Phase 3: Re-execute decision tables that depend on rule outputs
        // (e.g., "Belasting op basis van reisduur" needs "belasting op basis van afstand")
        // ============================================================
        for (const beslistabel of beslistabels) {
          const targetType = this.deduceBeslistabelTargetType(beslistabel, context);
          if (!targetType) continue;

          const instances = (context as any).getObjectsByType(targetType);
          for (const instance of instances) {
            const previousInstance = (context as any).current_instance;
            (context as any).current_instance = instance;
            try {
              this.decisionTableExecutor.execute(beslistabel, context);
            } catch (e) {
              // Log error but continue
              console.warn(`Decision table phase 3 error for ${beslistabel.naam}: ${e}`);
            } finally {
              (context as any).current_instance = previousInstance;
            }
          }
        }

        // ============================================================
        // Phase 4: Re-run Gelijkstelling rules that depend on decision tables
        // (e.g., "Te betalen belasting" needs "belasting op basis van reisduur" from Phase 3)
        // ============================================================
        for (const rule of (ast as any).rules || []) {
          // Only re-run Gelijkstelling rules
          // Support both result (English from parseModel) and resultaat (Dutch) property names
          const resultType = rule.result?.type || rule.resultaat?.type;
          if (resultType !== 'Gelijkstelling') continue;

          const targetType = this.deduceRuleTargetType(rule, context);
          if (!targetType) {
            // No target type - execute directly
            const result = this.ruleExecutor.execute(rule, context);
            if (result.success && result.value) {
              lastResult = { success: true, value: result.value };
            }
            continue;
          }

          // Iterate over all instances of target type
          const instances = (context as any).getObjectsByType(targetType);
          for (const instance of instances) {
            const previousInstance = (context as any).current_instance;
            (context as any).current_instance = instance;
            try {
              const result = this.ruleExecutor.execute(rule, context);
              if (result.success && result.value) {
                lastResult = { success: true, value: result.value };
              }
            } finally {
              (context as any).current_instance = previousInstance;
            }
          }
          // Silently continue on errors - rule may have already been evaluated correctly
        }

        // Execute each regelgroep in sequence
        for (const regelGroep of (ast as any).regelGroepen || []) {
          const result = this.ruleExecutor.executeRegelGroep(regelGroep, context);
          if (!result.success) {
            return {
              success: false,
              error: result.error
            };
          }
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

    // Build a map of unit name -> conversion info for graph traversal
    const conversionMap = new Map<string, { factor: number; toUnit: string }>();
    const unitDefs = new Map<string, typeof unitSystemDef.units[0]>();

    for (const unitDef of unitSystemDef.units) {
      unitDefs.set(unitDef.name, unitDef);
      if (unitDef.conversion) {
        conversionMap.set(unitDef.name, {
          factor: unitDef.conversion.factor,
          toUnit: unitDef.conversion.toUnit
        });
      }
    }

    // First pass: add all units and resolve abbreviations
    for (const unitDef of unitSystemDef.units) {
      const baseUnit: BaseUnit = {
        name: unitDef.name,
        plural: unitDef.plural,
        abbreviation: unitDef.abbreviation,
        symbol: unitDef.symbol
      };
      system.addUnit(baseUnit);
    }

    // Second pass: compute toBaseFactor for each unit via graph traversal
    // A unit without outgoing conversion edge is a "base" unit (toBaseFactor = 1)
    // For units with conversions, walk the chain accumulating factors
    const computeToBaseFactor = (unitName: string, visited: Set<string>): number | undefined => {
      // Prevent infinite loops
      if (visited.has(unitName)) {
        return undefined;
      }
      visited.add(unitName);

      const conversion = conversionMap.get(unitName);
      if (!conversion) {
        // No outgoing conversion - this is a base unit
        return 1;
      }

      // Resolve the target unit name (might be abbreviation)
      const targetUnit = system.findUnit(conversion.toUnit);
      if (!targetUnit) {
        // Target not found - can't compute factor
        return undefined;
      }

      // Recursively compute the target's toBaseFactor
      const targetFactor = computeToBaseFactor(targetUnit.name, visited);
      if (targetFactor === undefined) {
        return undefined;
      }

      // Our toBaseFactor = conversion.factor * targetFactor
      return conversion.factor * targetFactor;
    };

    // Third pass: set toBaseFactor for all units
    for (const unitDef of unitSystemDef.units) {
      const toBaseFactor = computeToBaseFactor(unitDef.name, new Set());

      // Re-add the unit with toBaseFactor computed
      const updatedUnit: BaseUnit = {
        name: unitDef.name,
        plural: unitDef.plural,
        abbreviation: unitDef.abbreviation,
        symbol: unitDef.symbol,
        toBaseFactor: toBaseFactor ?? 1,
        // Keep legacy fields for backward compatibility
        conversionFactor: unitDef.conversion?.factor,
        conversionToUnit: unitDef.conversion ? system.findUnit(unitDef.conversion.toUnit)?.name : undefined
      };

      system.addUnit(updatedUnit);
    }

    // Register the system in the unit registry
    this.unitRegistry.addSystem(system);

    // Also make the registry available in the context
    // This allows expression evaluator to access custom units
    (context as any).unitRegistry = this.unitRegistry;
  }

  /**
   * Deduce the target object type from a decision table's result column header.
   * Parses patterns like "de woonregio factor van een Natuurlijk persoon" → "Natuurlijk persoon"
   * Also maps Feittype role names (e.g., "passagier") to their object types ("Natuurlijk persoon").
   */
  private deduceBeslistabelTargetType(table: any, context?: RuntimeContext): string | undefined {
    let rawType: string | undefined;

    // First, try using parsedResult if available (pre-parsed by header parser)
    if (table.parsedResult?.targetExpression?.path?.length >= 1) {
      // Path format: ["Natuurlijk persoon", "woonregio factor"]
      // First element is the object type
      rawType = table.parsedResult.targetExpression.path[0];
    }

    // Try to parse from resultColumn string (singular)
    if (!rawType && typeof table.resultColumn === 'string') {
      // Pattern: "de/het X van een/de/het Y moet gesteld worden op"
      // We want to extract Y (the object type)
      const vanMatch = table.resultColumn.match(/van\s+(?:een|de|het)\s+(.+?)\s+moet/i);
      if (vanMatch) {
        rawType = vanMatch[1].trim();
      }
    }

    // Legacy: Get the result columns from the table (for older structures)
    if (!rawType) {
      const resultColumns = table.resultColumns || table.results || [];

      for (const column of resultColumns) {
        const headerText = column.headerText || column.header || '';

        // Pattern: "de/het X van een/de/het Y"
        // We want to extract Y (the object type)
        const vanMatch = headerText.match(/van\s+(?:een|de|het)\s+(.+?)(?:\s+moet|\s*$)/i);
        if (vanMatch) {
          rawType = vanMatch[1].trim();
          break;
        }

        // Alternative pattern: look for object type reference in target expression
        if (column.targetExpression?.path?.length >= 2) {
          // Path format: ["passagier", "woonregio factor"] or similar
          const possibleType = column.targetExpression.path[0];
          if (possibleType) {
            rawType = possibleType;
            break;
          }
        }
      }
    }

    // Try to get from the first row's result assignment target
    if (!rawType) {
      const rows = table.rows || [];
      if (rows.length > 0 && rows[0].results?.length > 0) {
        const firstResult = rows[0].results[0];
        if (firstResult?.target?.path?.length >= 2) {
          rawType = firstResult.target.path[0];
        }
      }
    }

    // If we found a type, check if it's a Feittype role and map to object type
    if (rawType && context) {
      // Try to map the role alias to its object type
      const mappedType = this.roleAliasToObjectType(rawType, context);
      if (mappedType) {
        return mappedType;
      }
    }

    return rawType;
  }

  /**
   * Deduce the source object type for an ObjectCreation rule by scanning
   * its expressions for capitalized object type references (e.g., "de Vlucht").
   * This mirrors Python's _deduce_rule_target_type behavior.
   *
   * @deprecated Use deduceRuleTargetType() instead. This method is kept for backward compatibility.
   */
  private deduceObjectCreationSourceType(rule: any, context: RuntimeContext): string | undefined {
    // Check both 'result' (parsed) and 'resultaat' (legacy) field names
    const objectCreation = rule.result || rule.resultaat;
    if (!objectCreation || objectCreation.type !== 'ObjectCreation') {
      return undefined;
    }

    // For ObjectCreation WITHOUT conditions, use FeitType-based deduction
    // (mirrors Python engine.py:529-557)
    // Pattern: "Een X heeft het Y" - we need to iterate over X
    if (!rule.condition && !rule.voorwaarde) {
      const objectType = objectCreation.objectType;
      const objectTypeLower = this.stripArticles(objectType).toLowerCase();
      // Also normalize by removing spaces for comparison (parser may have concatenated words)
      const objectTypeNormalized = objectTypeLower.replace(/\s+/g, '');

      const feittypen = (context as any).getAllFeittypen?.() || [];

      // First pass: exact matches (prefer these to avoid false positives)
      for (const feittype of feittypen) {
        for (const role of feittype.rollen || []) {
          const roleNameLower = this.stripArticles(role.naam).toLowerCase();
          const roleNameNormalized = roleNameLower.replace(/\s+/g, '');
          const roleObjectTypeLower = role.objectType?.toLowerCase() || '';
          const roleObjectTypeNormalized = roleObjectTypeLower.replace(/\s+/g, '');

          // Exact match on role name or role objectType (with space normalization)
          if (roleNameNormalized === objectTypeNormalized || roleObjectTypeNormalized === objectTypeNormalized) {
            // Found matching FeitType - return the OTHER role's objectType
            for (const otherRole of feittype.rollen || []) {
              if (otherRole.naam !== role.naam) {
                return otherRole.objectType;
              }
            }
          }
        }
      }

      // Second pass: substring containment (for compound names)
      for (const feittype of feittypen) {
        for (const role of feittype.rollen || []) {
          const roleNameLower = this.stripArticles(role.naam).toLowerCase();
          const roleNameNormalized = roleNameLower.replace(/\s+/g, '');
          const roleObjectTypeLower = role.objectType?.toLowerCase() || '';
          const roleObjectTypeNormalized = roleObjectTypeLower.replace(/\s+/g, '');

          if (roleNameNormalized.includes(objectTypeNormalized) || objectTypeNormalized.includes(roleNameNormalized) ||
            roleObjectTypeNormalized.includes(objectTypeNormalized) || objectTypeNormalized.includes(roleObjectTypeNormalized)) {
            for (const otherRole of feittype.rollen || []) {
              if (otherRole.naam !== role.naam) {
                return otherRole.objectType;
              }
            }
          }
        }
      }
    }

    // Fall back to expression scanning for VariableReference or AttributeReference
    // with capitalized names that match object types
    const candidates = new Set<string>();

    const extractTypeReferences = (expr: any): void => {
      if (!expr) return;

      // Check VariableReference
      if (expr.type === 'VariableReference') {
        const name = expr.variableName;
        // Capitalized names like "Vlucht" or "Natuurlijk persoon" are potential object types
        if (name && /^[A-Z]/.test(name)) {
          candidates.add(name);
        }
      }

      // Check AttributeReference paths
      if (expr.type === 'AttributeReference' && expr.path) {
        for (const segment of expr.path) {
          if (typeof segment === 'string' && /^[A-Z]/.test(segment)) {
            candidates.add(segment);
          }
        }
      }

      // Recurse into sub-expressions
      if (expr.left) extractTypeReferences(expr.left);
      if (expr.right) extractTypeReferences(expr.right);
      if (expr.operand) extractTypeReferences(expr.operand);
      if (expr.arguments) {
        for (const arg of expr.arguments) {
          extractTypeReferences(arg);
        }
      }
      if (expr.expression) extractTypeReferences(expr.expression);
      if (expr.collection) extractTypeReferences(expr.collection);
    };

    // Scan all attribute initializations
    for (const init of objectCreation.attributeInits || []) {
      extractTypeReferences(init.value);
    }

    // Also check the condition's expression if present
    if (rule.condition?.expression) {
      extractTypeReferences(rule.condition.expression);
    }

    // Find which candidate maps to an actual object type with instances
    for (const candidate of candidates) {
      const instances = (context as any).getObjectsByType(candidate);
      if (instances && instances.length > 0) {
        return candidate;
      }

      // Try with common variations (add space before capitals)
      const variations = [
        candidate.replace(/([a-z])([A-Z])/g, '$1 $2'),
        candidate.replace(/lijk(?=[A-Z])/g, 'lijk ')
      ];
      for (const variant of variations) {
        const varInstances = (context as any).getObjectsByType(variant);
        if (varInstances && varInstances.length > 0) {
          return variant;
        }
      }
    }

    return undefined;
  }

  /**
   * Strip Dutch articles from the beginning of a string
   */
  private stripArticles(text: string): string {
    return text.replace(/^(de|het|een)\s+/i, '').trim();
  }

  /**
   * Recursively extract all AttributeReference nodes from an expression.
   * Ports Python engine.py lines 490-510.
   */
  private extractAttributeReferences(expr: any): any[] {
    const refs: any[] = [];

    if (!expr) return refs;

    if (expr.type === 'AttributeReference') {
      refs.push(expr);
    } else if (expr.type === 'BinaryExpression') {
      refs.push(...this.extractAttributeReferences(expr.left));
      refs.push(...this.extractAttributeReferences(expr.right));
    } else if (expr.type === 'UnaryExpression') {
      refs.push(...this.extractAttributeReferences(expr.operand));
    } else if (expr.type === 'FunctionCall' && expr.arguments) {
      for (const arg of expr.arguments) {
        refs.push(...this.extractAttributeReferences(arg));
      }
    } else if (expr.type === 'SamengesteldeVoorwaarde' && expr.voorwaarden) {
      for (const voorwaarde of expr.voorwaarden) {
        refs.push(...this.extractAttributeReferences(voorwaarde));
      }
    }

    return refs;
  }

  /**
   * Deduce object type from a rule's condition expression.
   * Ports Python engine.py lines 463-488.
   */
  private deduceTypeFromCondition(voorwaarde: any, context: RuntimeContext): string | null {
    if (!voorwaarde) return null;

    const expression = voorwaarde.expression || voorwaarde.expressie;
    if (!expression) return null;

    const attrRefs = this.extractAttributeReferences(expression);

    for (const attrRef of attrRefs) {
      if (!attrRef.path || attrRef.path.length === 0) continue;

      // Get first path element (attribute name)
      let attrName = attrRef.path[0];
      attrName = this.stripArticles(attrName);

      // Find which object type owns this attribute
      const ctx = context as any;
      if (ctx.domainModel?.objectTypes) {
        for (const objType of ctx.domainModel.objectTypes) {
          // Check if attributen exists and is an object
          if (objType.attributen && typeof objType.attributen === 'object') {
            // Use hasOwnProperty instead of 'in' to avoid prototype chain issues
            if (Object.prototype.hasOwnProperty.call(objType.attributen, attrName)) {
              return objType.name;
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Map a role alias to its object type via FeitType definitions.
   * Ports Python engine.py lines 8896-8918.
   */
  private roleAliasToObjectType(name: string, context: RuntimeContext): string | null {
    if (!name) return null;

    const ctx = context as any;

    // Strip possessive pronouns first
    let nameCleaned = name.toLowerCase();
    for (const pronoun of ['zijn ', 'haar ', 'hun ']) {
      if (nameCleaned.startsWith(pronoun)) {
        nameCleaned = nameCleaned.substring(pronoun.length);
        break;
      }
    }

    nameCleaned = this.stripArticles(nameCleaned);

    // Search all FeitTypes
    const feittypen = ctx.getAllFeittypen?.() || [];
    for (const feittype of feittypen) {
      for (const rol of feittype.rollen || []) {
        if (!rol.naam) continue;

        const rolNaam = this.stripArticles(rol.naam).toLowerCase();
        const rolPlural = rol.meervoud ? this.stripArticles(rol.meervoud).toLowerCase() : '';

        if (nameCleaned === rolNaam || nameCleaned === rolPlural) {
          return rol.objectType;
        }
      }
    }

    return null;
  }

  /**
   * Deduce which object type this rule applies to.
   * Mirrors Python's _deduce_rule_target_type() for architectural parity.
   *
   * @param rule - The rule to analyze
   * @param context - Runtime context for accessing domain model
   * @returns Object type name to iterate over, or null if rule doesn't target objects
   */
  private deduceRuleTargetType(rule: any, context: RuntimeContext): string | null {
    const resultaat = rule.result || rule.resultaat;
    if (!resultaat) return null;

    // Debug logging for TOKA troubleshooting
    const ruleName = rule.name || rule.naam;

    // Type-based dispatch matching Python's architecture
    let targetType: string | null = null;
    switch (resultaat.type) {
      case 'Gelijkstelling':
      case 'KenmerkToekenning':
      case 'Initialisatie':
        targetType = this.deduceTypeFromAttributeTarget(resultaat, rule, context);
        break;

      case 'ObjectCreation':
        targetType = this.deduceTypeForObjectCreation(resultaat, rule, context);
        break;

      case 'Dagsoortdefinitie':
        targetType = 'Dag';
        break;

      case 'Consistentieregel':
        targetType = this.deduceTypeForConsistentieregel(resultaat, rule, context);
        break;

      case 'Verdeling':
        targetType = this.deduceTypeForVerdeling(resultaat, context);
        break;

      case 'FeitCreatie':
        targetType = this.deduceTypeForFeitCreatie(resultaat, context);
        break;

      default:
        targetType = null;
    }


    return targetType;
  }

  /**
   * Deduce type from attribute target (Gelijkstelling/KenmerkToekenning/Initialisatie).
   * Ports Python engine.py lines 517-849.
   */
  private deduceTypeFromAttributeTarget(resultaat: any, rule: any, context: RuntimeContext): string | null {
    const ctx = context as any;
    let targetRef = resultaat.target;

    // Handle DimensionedAttributeReference by extracting base attribute
    if (targetRef?.type === 'DimensionedAttributeReference') {
      targetRef = targetRef.baseAttribute;
    }

    if (!targetRef || !targetRef.path) return null;

    // Path structure: ["attribute", "object_type", ...]
    // e.g., ["resultaat", "Bedrag"] for "De resultaat van een Bedrag"
    // e.g., ["leeftijd", "Natuurlijk persoon"] for "De leeftijd van een Natuurlijk persoon"

    if (targetRef.path.length === 1) {
      // Single element path could be:
      // 1. Object type (for KenmerkToekenning)
      // 2. Attribute name (for Gelijkstelling)
      // 3. Role name

      const pathElem = targetRef.path[0];

      if (ctx.domainModel?.objectTypes) {
        // Try exact match as object type
        for (const objType of ctx.domainModel.objectTypes) {
          if (pathElem === objType.name) {
            return objType.name;
          }
        }

        // Try case-insensitive match as object type
        for (const objType of ctx.domainModel.objectTypes) {
          if (pathElem.toLowerCase() === objType.name.toLowerCase()) {
            return objType.name;
          }
        }

        // Try to match as a role name from FeitTypes
        const roleObjType = this.roleAliasToObjectType(pathElem, context);
        if (roleObjType) {
          return roleObjType;
        }

        // Not an object type - check if it's an attribute name
        for (const objType of ctx.domainModel.objectTypes) {
          if (objType.attributen && typeof objType.attributen === 'object') {
            if (Object.prototype.hasOwnProperty.call(objType.attributen, pathElem)) {
              return objType.name;
            }
          }
        }
      }
    } else if (targetRef.path.length >= 3) {
      // For paths with 3+ elements in nested navigation
      // Example: ['persoon', 'woonadres', 'postcode']
      // The first element (rightmost in Dutch) is typically the object type
      let potentialType = targetRef.path[0];
      potentialType = this.stripArticles(potentialType);

      if (ctx.domainModel?.objectTypes) {
        // Try exact match
        for (const objType of ctx.domainModel.objectTypes) {
          if (potentialType === objType.name) {
            return objType.name;
          }
        }

        // Try capitalized version
        const potentialTypeCap = potentialType.charAt(0).toUpperCase() + potentialType.slice(1);
        for (const objType of ctx.domainModel.objectTypes) {
          if (potentialTypeCap === objType.name) {
            return objType.name;
          }
        }

        // Try case-insensitive match
        for (const objType of ctx.domainModel.objectTypes) {
          if (potentialType.toLowerCase() === objType.name.toLowerCase()) {
            return objType.name;
          }
        }
      }
    } else if (targetRef.path.length === 2) {
      // Path could be:
      // 1. Dutch right-to-left for FeitType roles: ["reis", "totaal te betalen belasting"]
      // 2. Original left-to-right: ["inkomen", "Natuurlijk persoon"]
      // 3. Complex attribute with object type: ["belasting op basis van afstand", "passagier"]

      // Try both elements as potential object type/role
      for (let i = 0; i < 2; i++) {
        let potentialType = targetRef.path[i];
        potentialType = this.stripArticles(potentialType);

        if (ctx.domainModel?.objectTypes) {
          // Try exact match
          for (const objType of ctx.domainModel.objectTypes) {
            if (potentialType === objType.name) {
              return objType.name;
            }
          }

          // Try case-insensitive match
          for (const objType of ctx.domainModel.objectTypes) {
            if (potentialType.toLowerCase() === objType.name.toLowerCase()) {
              return objType.name;
            }
          }

          // Try capitalized match
          const potentialTypeCap = potentialType.charAt(0).toUpperCase() + potentialType.slice(1);
          for (const objType of ctx.domainModel.objectTypes) {
            if (potentialTypeCap === objType.name) {
              return objType.name;
            }
          }

          // Try role alias
          const roleObjType = this.roleAliasToObjectType(potentialType, context);
          if (roleObjType) {
            return roleObjType;
          }
        }
      }
    }

    return null;
  }

  /**
   * Deduce type for ObjectCreation rules.
   * Ports Python engine.py lines 523-560.
   */
  private deduceTypeForObjectCreation(resultaat: any, rule: any, context: RuntimeContext): string | null {
    // For ObjectCreation with condition, deduce from condition
    const voorwaarde = rule.voorwaarde || rule.condition;
    if (voorwaarde) {
      return this.deduceTypeFromCondition(voorwaarde, context);
    }

    // For ObjectCreation without condition, use FeitType relationships
    return this.deduceObjectCreationSourceType(rule, context) || null;
  }

  /**
   * Deduce type for Consistentieregel rules.
   * Ports Python engine.py lines 564-625.
   */
  private deduceTypeForConsistentieregel(resultaat: any, rule: any, context: RuntimeContext): string | null {
    const ctx = context as any;

    // For uniqueness checks, the target has pattern: ["alle", object_type, attribute]
    if (resultaat.criteriumType === 'uniek' && resultaat.target) {
      if (resultaat.target.type === 'AttributeReference' && resultaat.target.path?.length >= 3) {
        // The object type is the second element in the path (after "alle")
        const objType = resultaat.target.path[1];

        // Try exact match first
        if (ctx.domainModel?.objectTypes) {
          for (const definedType of ctx.domainModel.objectTypes) {
            if (definedType.name === objType) {
              return definedType.name;
            }
          }

          // Try plural form match
          for (const definedType of ctx.domainModel.objectTypes) {
            if (definedType.meervoud && definedType.meervoud === objType) {
              return definedType.name;
            }
          }

          // Try case-insensitive match
          const objTypeLower = objType.toLowerCase();
          for (const definedType of ctx.domainModel.objectTypes) {
            if (definedType.name.toLowerCase() === objTypeLower) {
              return definedType.name;
            }
          }

          // Try partial match as last resort
          for (const definedType of ctx.domainModel.objectTypes) {
            const defLower = definedType.name.toLowerCase();
            if (defLower.includes(objTypeLower) || objTypeLower.includes(defLower)) {
              return definedType.name;
            }
          }
        }
      }
    } else if (resultaat.criteriumType === 'inconsistent') {
      // Extract target from condition's attribute references
      // Check both resultaat.condition and rule.voorwaarde
      const condition = resultaat.condition || rule.voorwaarde?.expressie || rule.voorwaarde?.expression;

      if (condition) {
        const refs = this.extractAttributeReferences(condition);
        if (refs.length > 0) {
          // First try to find object type from the path
          for (const ref of refs) {
            if (ref.path) {
              for (const pathElement of ref.path) {
                // Check if it's a known object type (exact match)
                if (ctx.domainModel?.objectTypes) {
                  for (const objType of ctx.domainModel.objectTypes) {
                    if (pathElement === objType.name) {
                      return objType.name;
                    }
                  }

                  // Check case-insensitive match
                  for (const objType of ctx.domainModel.objectTypes) {
                    if (pathElement.toLowerCase() === objType.name.toLowerCase()) {
                      return objType.name;
                    }
                  }

                  // Check capitalized variant (e.g., "vlucht" → "Vlucht")
                  const pathCapitalized = pathElement.charAt(0).toUpperCase() + pathElement.slice(1);
                  for (const objType of ctx.domainModel.objectTypes) {
                    if (pathCapitalized === objType.name) {
                      return objType.name;
                    }
                  }
                }

                // Check if it's a role that maps to an object type
                const roleObjType = this.roleAliasToObjectType(pathElement, context);
                if (roleObjType) {
                  return roleObjType;
                }
              }
            }
          }

          // If no object type found in path, deduce from which object has these attributes
          for (const ref of refs) {
            if (ref.path && ref.path.length > 0) {
              const attrName = ref.path[0];
              // Search all object types to find which one has this attribute
              if (ctx.domainModel?.objectTypes) {
                for (const objType of ctx.domainModel.objectTypes) {
                  if (objType.attributen && typeof objType.attributen === 'object') {
                    if (Object.prototype.hasOwnProperty.call(objType.attributen, attrName)) {
                      return objType.name;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Deduce type for Verdeling rules.
   * Ports Python engine.py lines 670-694 (more comprehensive version).
   */
  private deduceTypeForVerdeling(resultaat: any, context: RuntimeContext): string | null {
    // For Verdeling, try to deduce from the source amount expression
    const ctx = context as any;

    if (resultaat.sourceAmount?.type === 'AttributeReference' && resultaat.sourceAmount.path) {
      for (const pathElem of resultaat.sourceAmount.path) {
        // First check if it's a role name that maps to an object type
        const roleObjType = this.roleAliasToObjectType(pathElem, context);
        if (roleObjType) {
          return roleObjType;
        }

        // Extract object type from the path element
        const words = pathElem.toLowerCase().split(/\s+/);

        // Try each object type
        if (ctx.domainModel?.objectTypes) {
          for (const objType of ctx.domainModel.objectTypes) {
            const objTypeWords = objType.name.toLowerCase().split(/\s+/);

            // Check if all words of the object type appear in the path element
            if (objTypeWords.every((word: string) => words.includes(word))) {
              return objType.name;
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Deduce type for FeitCreatie rules.
   * Ports Python engine.py lines 661-669.
   */
  private deduceTypeForFeitCreatie(resultaat: any, context: RuntimeContext): string | null {
    // Try subject1 first
    const result1 = this.deduceTypeFromSubjectRef(resultaat.subject1, context);
    if (result1) return result1;

    // Otherwise try subject2
    return this.deduceTypeFromSubjectRef(resultaat.subject2, context);
  }

  /**
   * Deduce object type from a FeitCreatie subject reference.
   * Ports Python engine.py lines 410-461.
   */
  private deduceTypeFromSubjectRef(subjectRef: any, context: RuntimeContext): string | null {
    if (!subjectRef || !subjectRef.path) return null;

    const ctx = context as any;

    for (const pathElem of subjectRef.path) {
      // Remove articles
      const cleanElem = this.stripArticles(pathElem);

      // Check if it's an exact object type match
      if (ctx.domainModel?.objectTypes) {
        for (const objType of ctx.domainModel.objectTypes) {
          if (cleanElem === objType.name) {
            return objType.name;
          }
        }
      }

      // Check if this is a role in a feittype
      const feittypen = ctx.getAllFeittypen?.() || [];
      for (const feittype of feittypen) {
        if (feittype.naam && feittype.naam.toLowerCase().includes(cleanElem.toLowerCase())) {
          if (feittype.rollen && feittype.rollen.length > 0) {
            return feittype.rollen[0].objectType;
          }
        }
      }

      // Try to find object type within the path element
      const pathElemLower = cleanElem.toLowerCase();
      const words = pathElemLower.split(/\s+/);

      if (words.length > 0) {
        // First try last word (most specific)
        const lastWord = words[words.length - 1];
        if (ctx.domainModel?.objectTypes) {
          for (const objType of ctx.domainModel.objectTypes) {
            if (lastWord === objType.name.toLowerCase()) {
              return objType.name;
            }
          }
        }

        // Try longer combinations from the end
        for (let length = words.length; length > 1; length--) {
          for (let start = 0; start <= words.length - length; start++) {
            const candidate = words.slice(start, start + length).join(' ');
            if (ctx.domainModel?.objectTypes) {
              for (const objType of ctx.domainModel.objectTypes) {
                if (candidate === objType.name.toLowerCase()) {
                  return objType.name;
                }
              }
            }
          }
        }
      }
    }

    return null;
  }
}