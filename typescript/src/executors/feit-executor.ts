import { RuntimeContext, RuleExecutionResult, Value } from '../interfaces';
import { FeitCreatie } from '../ast/rules';
import { Expression, AttributeReference } from '../ast/expressions';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import { FeitType } from '../ast/feittype';

/**
 * Executor for FeitCreatie (relationship creation)
 * Creates relationships between objects according to FeitType definitions
 */
export class FeitExecutor {
  private expressionEvaluator: ExpressionEvaluator;

  constructor() {
    this.expressionEvaluator = new ExpressionEvaluator();
  }

  /**
   * Execute a FeitCreatie rule result
   * Pattern: "Een [role1] van een [subject1] is een [role2] van een [subject2]"
   * - Right side (subject2/role2): Navigate to find existing objects
   * - Left side (subject1/role1): Create new relationships with those objects
   */
  executeFeitCreatie(feit: FeitCreatie, context: RuntimeContext): RuleExecutionResult {
    try {
      // 1. Navigate subject2 pattern to find target objects
      const targetObjects = this.navigateFeitCreatieSubject(feit.subject2, feit.role2, context);
      
      if (!targetObjects || targetObjects.length === 0) {
        console.log(`FeitCreatie: No target objects found for pattern: ${feit.role2} van ${this.getSubjectText(feit.subject2)}`);
        return {
          success: true,
          value: { type: 'string', value: 'No objects found to create relationships with' }
        };
      }

      // 2. Resolve subject1 to source object
      const subject1Obj = this.resolveSubject(feit.subject1, context);
      
      if (!subject1Obj || subject1Obj.type !== 'object') {
        throw new Error(`FeitCreatie could not resolve subject1: ${this.getSubjectText(feit.subject1)}`);
      }

      // 3. Find the matching FeitType from the context
      const matchingFeittype = this.findMatchingFeittype(feit.role1, context);
      if (!matchingFeittype) {
        console.warn(`No FeitType found for role: ${feit.role1}`);
      }
      const feittypeNaam = matchingFeittype?.naam || feit.role1;
      
      // Check if this is a reciprocal feittype
      const isReciprocal = matchingFeittype?.wederkerig || false;

      // 4. Create relationships for each target object
      let createdCount = 0;
      for (const targetObj of targetObjects) {
        if (targetObj.type !== 'object') {
          console.warn(`Skipping non-object target in FeitCreatie`);
          continue;
        }

        // Check if relationship already exists (avoid duplicates)
        if (context.findRelationships) {
          const existingRels = context.findRelationships({
            subject: subject1Obj,
            object: targetObj,
            feittypeNaam: feittypeNaam
          });
          if (existingRels && existingRels.length > 0) {
            continue; // Skip if relationship already exists
          }
        }

        // Create the relationship (if method is available)
        if (context.addRelationship) {
          context.addRelationship(feittypeNaam, subject1Obj, targetObj, 'VAN');
          createdCount++;
          
          console.log(`FeitCreatie: Created relationship - ${targetObj.value?.object_type_naam || 'object'} ` +
                     `is ${feit.role1} of ${subject1Obj.value?.object_type_naam || 'object'}`);
          
          // For reciprocal relationships, also create the reverse
          if (isReciprocal) {
            context.addRelationship(feittypeNaam, targetObj, subject1Obj, 'VAN');
            console.log(`FeitCreatie: Created reciprocal relationship - ${subject1Obj.value?.object_type_naam || 'object'} ` +
                       `is ${feit.role1} of ${targetObj.value?.object_type_naam || 'object'}`);
          }
        }
      }

      return {
        success: true,
        value: { 
          type: 'string', 
          value: `Created ${createdCount} relationship${createdCount !== 1 ? 's' : ''}` 
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error in FeitCreatie')
      };
    }
  }

  /**
   * Navigate a FeitCreatie subject pattern to find objects
   * Handles complex navigation like "de passagier van de reis met treinmiles van het vastgestelde contingent treinmiles"
   * Pattern: splits on "van" and navigates backwards through relationships
   */
  private navigateFeitCreatieSubject(subject: Expression, role: string, context: RuntimeContext): Value[] {
    if (subject.type !== 'AttributeReference') {
      // Fallback: evaluate the expression
      const result = this.expressionEvaluator.evaluate(subject, context);
      if (result.type === 'list' && Array.isArray(result.value)) {
        return result.value;
      }
      if (result.type === 'object') {
        return [result];
      }
      return [];
    }
    
    const ref = subject as AttributeReference;
    if (!ref.path || ref.path.length === 0) {
      return [];
    }
    
    // The path contains the entire navigation pattern as a single string
    // e.g., "een medewerker van een afdeling van de bonusgever van de toegekende bonus"
    const pattern = ref.path[0];
    console.log(`FeitCreatie navigation pattern: ${pattern}`);
    
    // Parse the navigation pattern by splitting on "van"
    // This gives us navigation segments in reverse order
    const segments = pattern.split(' van ').map(s => s.trim());
    console.log(`Navigation segments: ${segments}`);
    
    if (segments.length < 2) {
      // Simple pattern without navigation - try to find objects by role
      const cleanSegment = this.cleanArticles(pattern);
      
      // Check if it refers to current instance
      if (context.current_instance && context.current_instance.type === 'object') {
        const currentType = (context.current_instance.value?.object_type_naam || '').toLowerCase();
        if (currentType && (currentType.includes(cleanSegment) || cleanSegment.includes(currentType))) {
          return [context.current_instance];
        }
      }
      
      // Try to look up as variable
      const value = context.getVariable(cleanSegment.replace(/\s+/g, ''));
      if (value) {
        if (value.type === 'list' && Array.isArray(value.value)) {
          return value.value;
        }
        if (value.type === 'object') {
          return [value];
        }
      }
      
      return [];
    }
    
    // Start navigation from the end (current instance or specified object)
    const lastSegment = segments[segments.length - 1].toLowerCase();
    let startObj: Value | undefined = undefined;
    
    // Check if it refers to current instance
    if (context.current_instance && context.current_instance.type === 'object') {
      const currentType = (context.current_instance.value?.object_type_naam || '').toLowerCase();
      const cleanSegment = this.cleanArticles(lastSegment);
      console.log(`Checking if '${cleanSegment}' matches current instance type '${currentType}'`);
      
      if (currentType && (currentType.includes(cleanSegment) || cleanSegment.includes(currentType))) {
        startObj = context.current_instance;
        console.log(`Starting navigation from current instance: ${currentType}`);
      }
    }
    
    if (!startObj) {
      // Try to find an object matching the description
      const cleanSegment = this.cleanArticles(lastSegment).replace(/\s+/g, '');
      const value = context.getVariable(cleanSegment);
      if (value && value.type === 'object') {
        startObj = value;
      }
    }
    
    if (!startObj) {
      console.warn(`Could not find starting object for navigation`);
      return [];
    }
    
    // Navigate backwards through the segments
    let currentObjects = [startObj];
    
    // Process segments in reverse order (excluding last which is the starting point)
    for (let i = segments.length - 2; i >= 0; i--) {
      const segment = segments[i];
      const nextObjects: Value[] = [];
      console.log(`Navigating segment: '${segment}'`);
      
      // For each current object, find related objects
      for (const obj of currentObjects) {
        if (obj.type !== 'object') continue;
        
        const cleanSegment = this.cleanArticles(segment.toLowerCase());
        console.log(`Looking for objects matching segment '${cleanSegment}'`);
        
        // Look for objects related to current object via relationships
        if (context.findRelationships) {
          // Find relationships where obj is the subject
          const relationships = context.findRelationships({ subject: obj });
          console.log(`Found ${relationships.length} relationships from object`);
          
          for (const rel of relationships) {
            if (rel.object && this.matchesDescription(rel.object, cleanSegment)) {
              nextObjects.push(rel.object);
              console.log(`Match found via relationship`);
            }
          }
          
          // Also check reverse relationships (where obj is the object)
          const reverseRels = context.findRelationships({ object: obj });
          console.log(`Found ${reverseRels.length} reverse relationships to object`);
          
          for (const rel of reverseRels) {
            if (rel.subject && this.matchesDescription(rel.subject, cleanSegment)) {
              nextObjects.push(rel.subject);
              console.log(`Reverse match found via relationship`);
            }
          }
        }
      }
      
      if (nextObjects.length > 0) {
        currentObjects = nextObjects;
      } else {
        console.warn(`No objects found at segment '${segment}'`);
        // Continue with current objects (don't fail entirely)
      }
    }
    
    console.log(`Final objects after navigation: ${currentObjects.length} objects`);
    return currentObjects;
  }

  /**
   * Resolve a subject reference to an object
   */
  private resolveSubject(subject: Expression, context: RuntimeContext): Value | undefined {
    if (subject.type === 'AttributeReference') {
      const ref = subject as AttributeReference;
      
      // Check if it's a simple reference
      if (ref.path.length === 1) {
        // First check if it's the current instance
        const current = context.current_instance;
        if (current && current.type === 'object') {
          // Check if the reference matches the object type
          const objTypeName = current.value?.object_type_naam;
          if (objTypeName && ref.path[0].toLowerCase().includes(objTypeName.toLowerCase())) {
            return current;
          }
        }
        
        // Otherwise look up as variable
        // First try the exact name
        let value = context.getVariable(ref.path[0]);
        if (value) return value;
        
        // If it starts with an article, try without it
        const withoutArticle = ref.path[0].replace(/^(een|de|het)\s+/i, '');
        if (withoutArticle !== ref.path[0]) {
          value = context.getVariable(withoutArticle);
          if (value) return value;
        }
        
        return undefined;
      }
    }
    
    // Evaluate the expression
    return this.expressionEvaluator.evaluate(subject, context);
  }

  /**
   * Get text representation of a subject for logging
   */
  private getSubjectText(subject: Expression): string {
    if (subject.type === 'AttributeReference') {
      return (subject as AttributeReference).path.join('.');
    }
    return 'unknown';
  }

  /**
   * Find a FeitType that has the given role
   */
  private findMatchingFeittype(roleName: string, context: RuntimeContext): FeitType | undefined {
    // Use the context's findFeittypeByRole method if available
    if (context.findFeittypeByRole) {
      return context.findFeittypeByRole(roleName);
    }
    
    // Fallback: try the role name itself as a FeitType name
    if (context.getFeittype) {
      return context.getFeittype(roleName);
    }
    
    return undefined;
  }
  
  /**
   * Clean articles from a segment (de, het, een)
   */
  private cleanArticles(text: string): string {
    return text
      .replace(/^de\s+/i, '')
      .replace(/^het\s+/i, '')
      .replace(/^een\s+/i, '')
      .trim();
  }
  
  /**
   * Check if an object matches a description
   */
  private matchesDescription(obj: Value, description: string): boolean {
    if (obj.type !== 'object') return false;
    
    const objType = (obj.value?.object_type_naam || '').toLowerCase();
    const desc = description.toLowerCase();
    
    // Check if description matches object type
    return objType.includes(desc) || desc.includes(objType);
  }
}