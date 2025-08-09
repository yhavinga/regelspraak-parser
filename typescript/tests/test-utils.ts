/**
 * Test utilities for RegelSpraak tests
 */

/**
 * Helper to strip location properties from AST nodes for testing.
 * Now that all AST nodes have location properties, we need to strip them
 * when comparing against expected AST structures in tests.
 */
export function stripLocations(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(stripLocations);
  }
  const result: any = {};
  for (const key in obj) {
    if (key !== 'location') {
      result[key] = stripLocations(obj[key]);
    }
  }
  return result;
}