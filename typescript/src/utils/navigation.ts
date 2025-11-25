import { Value, RuntimeContext } from '../interfaces';
import { Context } from '../runtime/context';

export interface NavigationResult {
  targetObject: Value | null;
  attributeName: string;
  error?: string;
}

/**
 * Navigate through a Feittype relationship to find a related object.
 * This allows navigation like "eigenaar" from a "gebouw" object when
 * there's a Feittype defining the relationship between them.
 * 
 * @param roleName The role name to navigate to (e.g., "eigenaar")
 * @param fromObject The object to navigate from
 * @param context The runtime context with Feittype definitions
 * @returns The related object, or null if no relationship found
 */
function navigateThroughFeittype(roleName: string, fromObject: Value, context: Context): Value | null {
  // Get all registered Feittypen from the context
  const feittypen = (context as any).feittypen || new Map();
  
  // Clean the role name for comparison
  const roleNameClean = roleName.toLowerCase()
    .replace(/^de\s+/, '')
    .replace(/^het\s+/, '')
    .replace(/^een\s+/, '');
  
  // Check each Feittype for matching roles
  for (const [feittypeName, feittype] of feittypen) {
    for (const rol of feittype.rollen) {
      const rolNaamClean = rol.naam.toLowerCase()
        .replace(/^de\s+/, '')
        .replace(/^het\s+/, '')
        .replace(/^een\s+/, '');
      
      // Check for exact match or plural forms
      if (rolNaamClean === roleNameClean ||
          rol.meervoud?.toLowerCase() === roleNameClean ||
          (roleNameClean.endsWith('s') && roleNameClean.slice(0, -1) === rolNaamClean) ||
          (roleNameClean.endsWith('en') && roleNameClean.slice(0, -2) === rolNaamClean)) {
        
        // Found a matching role - check if current object can participate
        const fromObjectType = (fromObject.value as any).__type || 
                               (fromObject as any).objectType;
        
        // Find if the fromObject's type matches any role in this Feittype
        for (let otherIdx = 0; otherIdx < feittype.rollen.length; otherIdx++) {
          const otherRol = feittype.rollen[otherIdx];
          if (otherRol !== rol && otherRol.objectType === fromObjectType) {
            // The fromObject can participate in this Feittype
            // Get related objects through this relationship
            const asSubject = (otherIdx === 0);
            const relatedObjects = context.getRelatedObjects(fromObject, feittypeName, asSubject);
            
            if (relatedObjects && relatedObjects.length > 0) {
              // For navigation, return the first related object
              // (similar to Python implementation)
              return relatedObjects[0];
            }
          }
        }
      }
    }
  }
  
  return null;
}

/**
 * Resolves a complex navigation path to find the target object and attribute.
 * 
 * Dutch right-to-left navigation per specification:
 * For a path like ["vlucht", "passagier", "leeftijd"], this will:
 * 1. Start from the base object (vlucht)
 * 2. Navigate to passagier
 * 3. Return the passagier object and "leeftijd" as the attribute to set
 * 
 * @param path The navigation path from base object to attribute (object-first order)
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
      attributeName: '',
      error: 'Empty navigation path'
    };
  }

  if (path.length === 1) {
    // Simple attribute - target is the start object or current instance
    const ctx = context as Context;
    const target = startObject || ctx.current_instance || null;
    return {
      targetObject: target,
      attributeName: path[0]
    };
  }

  // Path is now object-first: ["vlucht", "passagier", "leeftijd"]
  // Extract the attribute name (last element) and navigation chain (everything except last)
  const attributeName = path[path.length - 1];
  const navigationChain = path.slice(0, -1);

  // Start with the provided start object or current instance
  let currentObject = startObject;
  let navPath = navigationChain;
  let gotFromVariable = false;

  if (!currentObject) {
    const ctx = context as Context;
    currentObject = ctx.current_instance;

    if (!currentObject) {
      // As a fallback, try to get the first element (base object) as a variable
      const baseName = navigationChain[0];
      currentObject = ctx.getVariable(baseName);

      if (!currentObject) {
        return {
          targetObject: null,
          attributeName: '',
          error: `No starting object available for navigation`
        };
      }

      // When we got the object from a variable, always skip the first element
      // This matches Python's _navigate_to_target behavior (engine.py:2448-2600)
      gotFromVariable = true;
      navPath = navigationChain.slice(1);
    }
  }

  // Only check for object type match if we didn't get from variable
  if (!gotFromVariable && navPath.length > 0) {
    // Check if the first element is the object type
    const currentObjType = (currentObject.value as any).__type ||
                           (currentObject as any).objectType;
    if (currentObjType && navPath[0].toLowerCase() === currentObjType.toLowerCase()) {
      // Skip the first element as it's just referring to the current object type
      navPath = navPath.slice(1);
    }
  }
  
  // Navigate through the path
  for (const navAttribute of navPath) {
    if (!currentObject || currentObject.type !== 'object') {
      return {
        targetObject: null,
        attributeName: '',
        error: `Cannot navigate through non-object at '${navAttribute}'`
      };
    }

    // First try direct attribute navigation
    const objectData = currentObject.value as Record<string, Value>;
    let nextObject = objectData[navAttribute];
    
    // If no direct attribute, try Feittype relationship navigation
    if (!nextObject) {
      const ctx = context as Context;
      const relatedObject = navigateThroughFeittype(navAttribute, currentObject, ctx);
      
      if (!relatedObject) {
        return {
          targetObject: null,
          attributeName: '',
          error: `Navigation attribute '${navAttribute}' not found and no matching Feittype relationship`
        };
      }
      
      nextObject = relatedObject;
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
 * Object-scoped rules have the pattern: ["ObjectType", ..., "attribute"]
 * where the first element is a capitalized object type name.
 * 
 * @param path The navigation path (object-first order)
 * @returns True if this is an object-scoped rule pattern
 */
export function isObjectScopedRule(path: string[]): boolean {
  if (path.length < 2) {
    return false;
  }
  
  const firstElement = path[0];
  // Check if the first element starts with a capital letter (object type convention)
  return !!(firstElement && firstElement[0] === firstElement[0].toUpperCase());
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
  // Use current instance as the starting point if available
  const ctx = context as Context;
  const startObject = ctx.current_instance;
  const navigationResult = resolveNavigationPath(path, context, startObject);
  
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