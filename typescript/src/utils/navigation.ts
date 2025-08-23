import { Value, RuntimeContext } from '../interfaces';
import { Context } from '../runtime/context';

export interface NavigationResult {
  targetObject: Value | null;
  attributeName: string;
  error?: string;
}

/**
 * Resolves a complex navigation path to find the target object and attribute.
 * 
 * For a path like ["leeftijd", "passagier", "vlucht"], this will:
 * 1. Start from the base object (vlucht)
 * 2. Navigate to passagier
 * 3. Return the passagier object and "leeftijd" as the attribute to set
 * 
 * @param path The navigation path from attribute to base object
 * @param context The runtime context
 * @param startObject Optional starting object, otherwise uses current instance
 * @returns Navigation result with target object and attribute name
 */
export function resolveNavigationPath(
  path: string[],
  context: RuntimeContext,
  startObject?: Value
): NavigationResult {
  if (path.length === 0) {
    return {
      targetObject: null,
      error: 'Empty navigation path'
    };
  }

  if (path.length === 1) {
    // Simple attribute - target is the start object or current instance
    const ctx = context as Context;
    const target = startObject || ctx.current_instance;
    return {
      targetObject: target,
      attributeName: path[0]
    };
  }

  // Extract the attribute name (first element) and navigation chain (rest)
  const attributeName = path[0];
  const navigationChain = path.slice(1);

  // Start navigation from the last element (working backwards through the path)
  let currentObject = startObject;
  
  if (!currentObject) {
    // Try to get the base object from context
    const ctx = context as Context;
    const baseName = navigationChain[navigationChain.length - 1];
    
    // Check if it's a variable
    currentObject = ctx.getVariable(baseName);
    
    if (!currentObject) {
      // Check if it's the current instance
      if (ctx.current_instance && ctx.current_instance.type === 'object') {
        const objTypeName = (ctx.current_instance.value as any).__type || 
                           (ctx.current_instance as any).objectType;
        if (objTypeName === baseName) {
          currentObject = ctx.current_instance;
        }
      }
    }
    
    if (!currentObject) {
      return {
        targetObject: null,
        error: `Base object '${baseName}' not found in context`
      };
    }
  }

  // Navigate through the chain from right to left (excluding the last element which we already handled)
  for (let i = navigationChain.length - 2; i >= 0; i--) {
    const navAttribute = navigationChain[i];
    
    if (!currentObject || currentObject.type !== 'object') {
      return {
        targetObject: null,
        error: `Cannot navigate through non-object at '${navAttribute}'`
      };
    }

    const objectData = currentObject.value as Record<string, Value>;
    const nextObject = objectData[navAttribute];
    
    if (!nextObject) {
      return {
        targetObject: null,
        error: `Navigation attribute '${navAttribute}' not found`
      };
    }
    
    currentObject = nextObject;
  }

  return {
    targetObject: currentObject,
    attributeName
  };
}

/**
 * Checks if a path represents an object-scoped rule pattern.
 * Object-scoped rules have the pattern: ["attribute", ..., "ObjectType"]
 * where the last element is a capitalized object type name.
 * 
 * @param path The navigation path
 * @returns True if this is an object-scoped rule pattern
 */
export function isObjectScopedRule(path: string[]): boolean {
  if (path.length < 2) {
    return false;
  }
  
  const lastElement = path[path.length - 1];
  // Check if the last element starts with a capital letter (object type convention)
  return lastElement && lastElement[0] === lastElement[0].toUpperCase();
}

/**
 * Navigates through a complex path to set an attribute value.
 * Handles both direct navigation and object-scoped rules.
 * 
 * @param path The navigation path
 * @param value The value to set
 * @param context The runtime context
 * @returns Success status and any error message
 */
export function setValueAtPath(
  path: string[],
  value: Value,
  context: RuntimeContext
): { success: boolean; error?: string } {
  const navigationResult = resolveNavigationPath(path, context);
  
  if (!navigationResult.targetObject) {
    return {
      success: false,
      error: navigationResult.error || 'Failed to resolve navigation path'
    };
  }
  
  if (navigationResult.targetObject.type !== 'object') {
    return {
      success: false,
      error: 'Target is not an object'
    };
  }
  
  // Set the attribute value
  const objectData = navigationResult.targetObject.value as Record<string, Value>;
  objectData[navigationResult.attributeName] = value;
  
  return { success: true };
}