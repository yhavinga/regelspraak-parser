/**
 * REST API route handlers for the RegelSpraak server.
 */

import { Router, Request, Response } from 'express';
import { Engine } from '../engine/engine';
import { Context } from '../runtime/context';
import { Value } from '../interfaces';
import { DomainModel } from '../ast/domain-model';

export interface ServerOptions {
  model: DomainModel;
  engine: Engine;
  files: string[];
}

/**
 * Input data schema for execution
 */
export interface ExecuteRequest {
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
 * Parse a value from input JSON into a proper Value object
 */
function parseValue(v: any): Value {
  if (v && typeof v === 'object' && 'value' in v) {
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
function populateContext(context: Context, data: ExecuteRequest): void {
  if (data.rekendatum) {
    context.setEvaluationDate(new Date(data.rekendatum));
  }

  for (const [name, value] of Object.entries(data.parameters || {})) {
    context.setVariable(name, parseValue(value));
  }

  const objectMap: Map<string, { type: string; value: Value }> = new Map();

  for (const [typeName, instances] of Object.entries(data.objects || {})) {
    for (const instance of instances) {
      const { id, ...attrs } = instance;
      const parsedAttrs: Record<string, Value> = {};
      for (const [k, v] of Object.entries(attrs)) {
        parsedAttrs[k] = parseValue(v);
      }
      context.createObject(typeName, id, parsedAttrs);

      const objects = context.getObjectsByType(typeName);
      const obj = objects.find((o: any) => o.objectId === id);
      if (obj) {
        objectMap.set(`${typeName}:${id}`, { type: typeName, value: obj });
      }
    }
  }

  for (const rel of data.relationships || []) {
    let fromObj: Value | undefined;
    let toObj: Value | undefined;

    if (rel.fromType) {
      const fromRef = objectMap.get(`${rel.fromType}:${rel.from}`);
      if (fromRef) fromObj = fromRef.value;
    } else {
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
  const knownTypes = new Set<string>();

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

      for (const [key, val] of Object.entries(kenmerken)) {
        serialized[key] = val;
      }

      result[typeName][objId] = serialized;
    }
  }

  return result;
}

/**
 * Extract model metadata for the /api/model endpoint
 */
function extractModelMetadata(model: DomainModel): object {
  const objectTypes = (model.objectTypes || []).map((ot: any) => {
    const attributes: string[] = [];
    const kenmerken: string[] = [];

    if (ot.attributen && typeof ot.attributen === 'object') {
      for (const [attrName, attrDef] of Object.entries(ot.attributen)) {
        attributes.push(attrName);
      }
    }

    if (ot.kenmerken && Array.isArray(ot.kenmerken)) {
      for (const k of ot.kenmerken) {
        kenmerken.push(typeof k === 'string' ? k : k.name || k.naam);
      }
    }

    return {
      name: ot.name,
      attributes,
      kenmerken
    };
  });

  const parameters = (model.parameters || []).map((p: any) => ({
    name: p.name || p.naam,
    type: p.datatype?.type || p.type || 'unknown',
    unit: p.datatype?.unit?.name || p.unit || undefined
  }));

  const relationships = (model.feitTypes || []).flatMap((ft: any) => {
    if (!ft.rollen || ft.rollen.length < 2) return [];
    return [{
      name: ft.naam,
      from: ft.rollen[0]?.objectType,
      to: ft.rollen[1]?.objectType
    }];
  });

  return {
    objectTypes,
    parameters,
    relationships
  };
}

/**
 * Validate input data against model (without execution)
 */
function validateInput(
  data: ExecuteRequest,
  model: DomainModel
): { valid: boolean; errors: Array<{ path: string; message: string }> } {
  const errors: Array<{ path: string; message: string }> = [];

  const knownTypes = new Set<string>();
  const typeAttributes = new Map<string, Set<string>>();

  for (const objType of model.objectTypes || []) {
    knownTypes.add(objType.name);
    const attrs = new Set<string>();
    if ((objType as any).attributen && typeof (objType as any).attributen === 'object') {
      for (const attrName of Object.keys((objType as any).attributen)) {
        attrs.add(attrName);
      }
    }
    typeAttributes.set(objType.name, attrs);
  }

  for (const [typeName, instances] of Object.entries(data.objects || {})) {
    if (!knownTypes.has(typeName)) {
      errors.push({
        path: `objects.${typeName}`,
        message: `Unknown object type: ${typeName}`
      });
      continue;
    }

    const validAttrs = typeAttributes.get(typeName) || new Set();

    instances.forEach((instance, idx) => {
      if (!instance.id) {
        errors.push({
          path: `objects.${typeName}[${idx}]`,
          message: 'Missing required field: id'
        });
      }

      for (const attrName of Object.keys(instance)) {
        if (attrName === 'id') continue;
        if (!validAttrs.has(attrName)) {
          errors.push({
            path: `objects.${typeName}[${idx}]`,
            message: `Unknown attribute: ${attrName}`
          });
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create the API router with all endpoints
 */
export function createRouter(options: ServerOptions): Router {
  const router = Router();
  const { model, engine, files } = options;

  // GET / - Health check and server info
  router.get('/', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      version: '0.2.0',
      files: files,
      endpoints: [
        'GET /api/ - Health check',
        'GET /api/model - Model metadata',
        'POST /api/validate - Validate input data',
        'POST /api/execute - Execute rules'
      ]
    });
  });

  // GET /model - Model metadata
  router.get('/model', (_req: Request, res: Response) => {
    res.json(extractModelMetadata(model));
  });

  // POST /validate - Validate input data without execution
  router.post('/validate', (req: Request, res: Response) => {
    const data: ExecuteRequest = req.body;
    const result = validateInput(data, model);
    res.json(result);
  });

  // POST /execute - Execute rules with provided state
  router.post('/execute', (req: Request, res: Response) => {
    const data: ExecuteRequest = req.body;

    try {
      const context = new Context(model);
      populateContext(context, data);

      const execResult = engine.execute(model, context);

      if (!execResult.success) {
        res.status(400).json({
          success: false,
          error: execResult.error?.message || 'Unknown execution error'
        });
        return;
      }

      const firedRules = context.getExecutionTrace()
        .filter(t => t.includes('RULE_FIRED'))
        .map(t => {
          const match = t.match(/rule_name='([^']+)'/);
          return match ? match[1] : t;
        });

      res.json({
        success: true,
        objects: serializeObjects(context),
        firedRules
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  });

  return router;
}
