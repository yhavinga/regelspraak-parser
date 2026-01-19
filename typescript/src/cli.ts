#!/usr/bin/env node
/**
 * RegelSpraak CLI - Command line interface for parsing and executing RegelSpraak rules.
 *
 * Usage:
 *   regelspraak validate <files...>          Parse and validate RegelSpraak files
 *   regelspraak run <files...> --data <json> Execute rules with input data
 *
 * Designed for use by coding agents that need structured JSON I/O.
 */

import * as fs from 'fs';
import * as path from 'path';
import { Engine } from './engine/engine';
import { Context } from './runtime/context';
import { Value } from './interfaces';
import { startServer } from './server';

/**
 * Input data schema for the CLI
 */
interface InputData {
  rekendatum?: string;
  parameters?: Record<string, any>;
  objects?: Record<string, Array<Record<string, any>>>;
  relationships?: Array<{
    type: string;
    from: string;
    to: string;
    fromType?: string;
    toType?: string;
  }>;
}

/**
 * Output schema for successful execution
 */
interface OutputData {
  success: boolean;
  objects?: Record<string, Record<string, any>>;
  fired_rules?: string[];
  error?: string;
  errors?: string[];
}

/**
 * Parse a value from input JSON into a proper Value object
 */
function parseValue(v: any): Value {
  if (v && typeof v === 'object' && 'value' in v) {
    // { value: 18, unit: 'jr' } format
    return {
      type: 'number',
      value: v.value,
      unit: v.unit ? { name: v.unit } : undefined
    };
  }
  if (typeof v === 'number') {
    return { type: 'number', value: v };
  }
  if (typeof v === 'boolean') {
    return { type: 'boolean', value: v };
  }
  if (typeof v === 'string') {
    // Check if it looks like an ISO date
    if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
      return { type: 'date', value: new Date(v) };
    }
    return { type: 'string', value: v };
  }
  if (v === null || v === undefined) {
    return { type: 'null', value: null };
  }
  if (Array.isArray(v)) {
    return { type: 'list', value: v.map(parseValue) };
  }
  return { type: 'object', value: v };
}

/**
 * Populate context with input data
 */
function populateContext(context: Context, data: InputData): void {
  // Set evaluation date
  if (data.rekendatum) {
    context.setEvaluationDate(new Date(data.rekendatum));
  }

  // Set parameters
  for (const [name, value] of Object.entries(data.parameters || {})) {
    context.setVariable(name, parseValue(value));
  }

  // Create objects
  // Track created objects for relationship linking
  const objectMap: Map<string, { type: string; value: Value }> = new Map();

  for (const [typeName, instances] of Object.entries(data.objects || {})) {
    for (const instance of instances) {
      const { id, ...attrs } = instance;
      const parsedAttrs: Record<string, Value> = {};
      for (const [k, v] of Object.entries(attrs)) {
        parsedAttrs[k] = parseValue(v);
      }
      context.createObject(typeName, id, parsedAttrs);

      // Store reference for relationship linking
      const objects = context.getObjectsByType(typeName);
      const obj = objects.find((o: any) => o.objectId === id);
      if (obj) {
        objectMap.set(`${typeName}:${id}`, { type: typeName, value: obj });
      }
    }
  }

  // Create relationships
  for (const rel of data.relationships || []) {
    // Find the objects by their IDs
    // Try to find objects using the provided types or by searching
    let fromObj: Value | undefined;
    let toObj: Value | undefined;

    if (rel.fromType) {
      const fromRef = objectMap.get(`${rel.fromType}:${rel.from}`);
      if (fromRef) fromObj = fromRef.value;
    } else {
      // Search all types for the object
      for (const [key, val] of objectMap.entries()) {
        if (key.endsWith(`:${rel.from}`)) {
          fromObj = val.value;
          break;
        }
      }
    }

    if (rel.toType) {
      const toRef = objectMap.get(`${rel.toType}:${rel.to}`);
      if (toRef) toObj = toRef.value;
    } else {
      // Search all types for the object
      for (const [key, val] of objectMap.entries()) {
        if (key.endsWith(`:${rel.to}`)) {
          toObj = val.value;
          break;
        }
      }
    }

    if (fromObj && toObj) {
      context.addRelationship(rel.type, fromObj, toObj);
    }
  }
}

/**
 * Serialize context objects to output format
 */
function serializeObjects(context: Context): Record<string, Record<string, any>> {
  const result: Record<string, Record<string, any>> = {};

  // Get all object types from context's internal storage
  // This is a bit of a hack since Context doesn't expose getAllTypes()
  // We'll collect types as we iterate through relationships and known types
  const knownTypes = new Set<string>();

  // Try to get objects from common patterns
  const commonTypes = [
    'Natuurlijk persoon', 'Passagier', 'Persoon',
    'Vlucht', 'Reis',
    'Dag'
  ];

  for (const typeName of commonTypes) {
    const objects = context.getObjectsByType(typeName);
    if (objects.length > 0) {
      knownTypes.add(typeName);
    }
  }

  // Also check domain model if available
  if (context.domainModel?.objectTypes) {
    for (const objType of context.domainModel.objectTypes) {
      knownTypes.add(objType.name);
    }
  }

  for (const typeName of knownTypes) {
    const objects = context.getObjectsByType(typeName);
    if (objects.length === 0) continue;

    if (!result[typeName]) {
      result[typeName] = {};
    }

    for (const obj of objects) {
      const objId = (obj as any).objectId;
      const attrs = (obj as any).value || {};
      const kenmerken = (obj as any).kenmerken || {};

      const serialized: Record<string, any> = {};

      // Serialize attributes
      for (const [key, val] of Object.entries(attrs)) {
        if (val && typeof val === 'object' && 'value' in (val as any)) {
          const v = val as Value;
          if (v.unit) {
            serialized[key] = { value: v.value, unit: v.unit.name };
          } else if (v.type === 'date' && v.value instanceof Date) {
            serialized[key] = v.value.toISOString().split('T')[0];
          } else {
            serialized[key] = v.value;
          }
        } else {
          serialized[key] = val;
        }
      }

      // Serialize kenmerken (boolean flags)
      for (const [key, val] of Object.entries(kenmerken)) {
        serialized[key] = val;
      }

      result[typeName][objId] = serialized;
    }
  }

  return result;
}

/**
 * Print usage information
 */
function printUsage(): void {
  console.log(`RegelSpraak CLI v0.2.0

Usage: regelspraak <command> [options]

Commands:
  validate <files...>          Parse and validate RegelSpraak files
  run <files...> --data <json> Execute rules with input data
  serve <files...>             Start REST API server

Options:
  --data <file>    JSON file with input data (objects, parameters, relationships)
  --port <number>  Port for serve command (default: 3000)
  --cors           Enable CORS for serve command
  --help           Show this help message

Input JSON schema:
{
  "rekendatum": "2024-07-15",
  "parameters": {
    "volwassenleeftijd": { "value": 18, "unit": "jr" }
  },
  "objects": {
    "Natuurlijk persoon": [
      { "id": "p1", "leeftijd": 25, "geboortedatum": "1999-03-15" }
    ]
  },
  "relationships": [
    { "type": "vlucht van natuurlijke personen", "from": "v1", "to": "p1" }
  ]
}

Output JSON schema (on success):
{
  "success": true,
  "objects": {
    "Natuurlijk persoon": {
      "p1": { "leeftijd": 25, "is minderjarig": false }
    }
  },
  "fired_rules": ["Regel minderjarig"]
}

Examples:
  regelspraak validate rules.rs
  regelspraak run gegevens.rs regels.rs --data input.json > output.json
  regelspraak serve gegevens.rs regels.rs --port 3000 --cors
`);
}

/**
 * Main entry point
 */
function main(): void {
  const args = process.argv.slice(2);

  // Handle help
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printUsage();
    process.exit(0);
  }

  const cmd = args[0];

  // Find --data flag position
  const dataIdx = args.indexOf('--data');
  const dataFile = dataIdx >= 0 && dataIdx + 1 < args.length ? args[dataIdx + 1] : null;

  // Find --port flag position
  const portIdx = args.indexOf('--port');
  const port = portIdx >= 0 && portIdx + 1 < args.length ? parseInt(args[portIdx + 1], 10) : 3000;

  // Check for --cors flag
  const enableCors = args.includes('--cors');

  // Collect file arguments (everything after command, excluding flags and their values)
  const files: string[] = [];
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--data' || args[i] === '--port') {
      i++; // Skip the value too
      continue;
    }
    if (args[i].startsWith('-')) continue;
    files.push(args[i]);
  }

  if (files.length === 0) {
    console.error(JSON.stringify({
      success: false,
      error: 'No input files specified'
    }, null, 2));
    process.exit(1);
  }

  // Load and combine .rs files
  let code = '';
  for (const file of files) {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      console.error(JSON.stringify({
        success: false,
        error: `File not found: ${file}`
      }, null, 2));
      process.exit(1);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    code += content + '\n\n';
  }

  const engine = new Engine();

  // Parse the model
  const parseResult = engine.parseModel(code);

  if (!parseResult.success) {
    const output: OutputData = {
      success: false,
      errors: parseResult.errors || ['Unknown parse error']
    };
    console.log(JSON.stringify(output, null, 2));
    process.exit(1);
  }

  // Validate command - just parse and report success
  if (cmd === 'validate') {
    console.log(JSON.stringify({ success: true }, null, 2));
    process.exit(0);
  }

  // Serve command - start REST API server
  if (cmd === 'serve') {
    startServer({
      model: parseResult.model,
      engine,
      files,
      port,
      cors: enableCors
    }).catch((err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
    return; // Don't exit - server keeps running
  }

  // Run command - execute with data
  if (cmd === 'run') {
    const context = new Context(parseResult.model);

    // Load and apply input data if provided
    if (dataFile) {
      const dataPath = path.resolve(dataFile);
      if (!fs.existsSync(dataPath)) {
        console.error(JSON.stringify({
          success: false,
          error: `Data file not found: ${dataFile}`
        }, null, 2));
        process.exit(1);
      }

      try {
        const data: InputData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        populateContext(context, data);
      } catch (e) {
        console.error(JSON.stringify({
          success: false,
          error: `Failed to parse data file: ${(e as Error).message}`
        }, null, 2));
        process.exit(1);
      }
    }

    // Execute the model
    const execResult = engine.execute(parseResult.model, context);

    if (!execResult.success) {
      const output: OutputData = {
        success: false,
        error: execResult.error?.message || 'Unknown execution error'
      };
      console.log(JSON.stringify(output, null, 2));
      process.exit(1);
    }

    // Serialize output
    const output: OutputData = {
      success: true,
      objects: serializeObjects(context),
      fired_rules: context.getExecutionTrace()
        .filter(t => t.includes('RULE_FIRED'))
        .map(t => {
          const match = t.match(/rule_name='([^']+)'/);
          return match ? match[1] : t;
        })
    };

    console.log(JSON.stringify(output, null, 2));
    process.exit(0);
  }

  // Unknown command
  console.error(JSON.stringify({
    success: false,
    error: `Unknown command: ${cmd}. Use 'validate', 'run', or 'serve'.`
  }, null, 2));
  process.exit(1);
}

main();
