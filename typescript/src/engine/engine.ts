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
          const targetType = this.deduceBeslistabelTargetType(beslistabel);
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
          // Special handling for ObjectCreation rules - need to iterate over source objects
          // Check both 'result' (parsed) and 'resultaat' (legacy) field names
          const ruleResult = rule.result || rule.resultaat;
          if (ruleResult?.type === 'ObjectCreation') {
            const sourceType = this.deduceObjectCreationSourceType(rule, context);
            if (sourceType) {
              // Iterate over all instances of the source type
              const instances = (context as any).getObjectsByType(sourceType);
              for (const instance of instances) {
                const previousInstance = (context as any).current_instance;
                (context as any).current_instance = instance;
                try {
                  // Evaluate condition if present
                  if (rule.condition) {
                    const conditionResult = this.expressionEvaluator.evaluate(rule.condition.expression, context);
                    if (conditionResult.type !== 'boolean' || !conditionResult.value) {
                      continue; // Condition not met - skip this instance
                    }
                  }
                  // Execute the ObjectCreation for this source instance
                  const result = this.ruleExecutor.execute(rule, context);
                  if (result.value) {
                    lastResult = { success: true, value: result.value };
                  }
                } catch (e) {
                  console.warn(`ObjectCreation rule '${rule.name || rule.naam}' failed for instance: ${e}`);
                } finally {
                  (context as any).current_instance = previousInstance;
                }
              }
              continue; // Skip normal execution
            }
          }

          const result = this.ruleExecutor.execute(rule, context);
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

        // ============================================================
        // Phase 3: Re-execute decision tables that depend on rule outputs
        // ============================================================
        for (const beslistabel of beslistabels) {
          const targetType = this.deduceBeslistabelTargetType(beslistabel);
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
          if (rule.resultaat?.type !== 'Gelijkstelling') continue;

          const result = this.ruleExecutor.execute(rule, context);
          if (result.success && result.value) {
            lastResult = {
              success: true,
              value: result.value
            };
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
          const targetType = this.deduceBeslistabelTargetType(beslistabel);
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
          // Special handling for ObjectCreation rules - need to iterate over source objects
          // Check both 'result' (parsed) and 'resultaat' (legacy) field names
          const ruleResult = rule.result || rule.resultaat;
          if (ruleResult?.type === 'ObjectCreation') {
            const sourceType = this.deduceObjectCreationSourceType(rule, context);
            if (sourceType) {
              // Iterate over all instances of the source type
              const instances = (context as any).getObjectsByType(sourceType);
              for (const instance of instances) {
                const previousInstance = (context as any).current_instance;
                (context as any).current_instance = instance;
                try {
                  // Evaluate condition if present
                  if (rule.condition) {
                    const conditionResult = this.expressionEvaluator.evaluate(rule.condition.expression, context);
                    if (conditionResult.type !== 'boolean' || !conditionResult.value) {
                      continue; // Condition not met - skip this instance
                    }
                  }
                  // Execute the ObjectCreation for this source instance
                  const result = this.ruleExecutor.execute(rule, context);
                  if (result.value) {
                    lastResult = { success: true, value: result.value };
                  }
                } catch (e) {
                  console.warn(`ObjectCreation rule '${rule.name || rule.naam}' failed for instance: ${e}`);
                } finally {
                  (context as any).current_instance = previousInstance;
                }
              }
              continue; // Skip normal execution
            }
          }

          const result = this.ruleExecutor.execute(rule, context);
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

        // ============================================================
        // Phase 3: Re-execute decision tables that depend on rule outputs
        // (e.g., "Belasting op basis van reisduur" needs "belasting op basis van afstand")
        // ============================================================
        for (const beslistabel of beslistabels) {
          const targetType = this.deduceBeslistabelTargetType(beslistabel);
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
          if (rule.resultaat?.type !== 'Gelijkstelling') continue;

          const result = this.ruleExecutor.execute(rule, context);
          if (result.success && result.value) {
            lastResult = {
              success: true,
              value: result.value
            };
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
   */
  private deduceBeslistabelTargetType(table: any): string | undefined {
    // Get the result columns from the table
    const resultColumns = table.resultColumns || table.results || [];

    for (const column of resultColumns) {
      const headerText = column.headerText || column.header || '';

      // Pattern: "de/het X van een/de/het Y"
      // We want to extract Y (the object type)
      const vanMatch = headerText.match(/van\s+(?:een|de|het)\s+(.+?)(?:\s+moet|\s*$)/i);
      if (vanMatch) {
        return vanMatch[1].trim();
      }

      // Alternative pattern: look for object type reference in target expression
      if (column.targetExpression?.path?.length >= 2) {
        // Path format: ["passagier", "woonregio factor"] or similar
        const possibleType = column.targetExpression.path[0];
        if (possibleType) {
          return possibleType;
        }
      }
    }

    // Try to get from the first row's result assignment target
    const rows = table.rows || [];
    if (rows.length > 0 && rows[0].results?.length > 0) {
      const firstResult = rows[0].results[0];
      if (firstResult?.target?.path?.length >= 2) {
        return firstResult.target.path[0];
      }
    }

    return undefined;
  }

  /**
   * Deduce the source object type for an ObjectCreation rule by scanning
   * its expressions for capitalized object type references (e.g., "de Vlucht").
   * This mirrors Python's _deduce_rule_target_type behavior.
   */
  private deduceObjectCreationSourceType(rule: any, context: RuntimeContext): string | undefined {
    // Check both 'result' (parsed) and 'resultaat' (legacy) field names
    const objectCreation = rule.result || rule.resultaat;
    if (!objectCreation || objectCreation.type !== 'ObjectCreation') {
      return undefined;
    }

    // Scan attribute init expressions for VariableReference or AttributeReference
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
}