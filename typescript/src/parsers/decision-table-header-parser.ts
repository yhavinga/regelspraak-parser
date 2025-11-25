/**
 * Parser for Beslistabel (decision table) column headers.
 * 
 * This module handles parsing natural language patterns in decision table
 * column headers into proper AST expressions that can be evaluated.
 */

import {
  Expression,
  AttributeReference,
  VariableReference
} from '../ast/expressions';

export interface ParsedCondition {
  /** The expression to evaluate for the condition subject */
  subjectExpression: Expression;
  /** The comparison operator */
  operator: string;
  /** Whether this is a kenmerk (characteristic) check */
  isKenmerkCheck: boolean;
  /** Name of the kenmerk for kenmerk checks */
  kenmerkName?: string;
}

export interface ParsedResult {
  /** Type of assignment */
  targetType: 'attribute' | 'kenmerk';
  /** The target expression to assign to */
  targetExpression: Expression;
  /** Name of kenmerk for kenmerk assignments */
  kenmerkName?: string;
}

export class DecisionTableHeaderParser {
  // Condition patterns - ordered from most specific to least specific
  private static readonly CONDITION_PATTERNS: Array<[RegExp, string]> = [
    // "indien de [attribute] van zijn [object] [operator]"
    [/^indien\s+de\s+(.+?)\s+van\s+(?:zijn|haar|hun|de|het|een)\s+(.+?)\s+(gelijk\s+is\s+aan|groter\s+is\s+dan|groter\s+of\s+gelijk\s+is\s+aan|kleiner\s+is\s+dan|kleiner\s+of\s+gelijk\s+is\s+aan|ongelijk\s+is\s+aan)\s*$/i,
     'attribute_of_object'],
    // "indien de [attribute] van [object] [operator]" (without possessive)
    [/^indien\s+de\s+(.+?)\s+van\s+(.+?)\s+(gelijk\s+is\s+aan|groter\s+is\s+dan|groter\s+of\s+gelijk\s+is\s+aan|kleiner\s+is\s+dan|kleiner\s+of\s+gelijk\s+is\s+aan|ongelijk\s+is\s+aan)\s*$/i,
     'attribute_of_named_object'],
    // "indien zijn [attribute] [operator]"
    [/^indien\s+(?:zijn|haar|hun)\s+(.+?)\s+(gelijk\s+is\s+aan|groter\s+is\s+dan|groter\s+of\s+gelijk\s+is\s+aan|kleiner\s+is\s+dan|kleiner\s+of\s+gelijk\s+is\s+aan|ongelijk\s+is\s+aan)\s*$/i,
     'simple_attribute'],
    // "indien hij een [kenmerk] heeft" or "indien hij [kenmerk] heeft"
    [/^indien\s+(?:hij|zij|het)\s+(?:een\s+)?(.+?)\s+heeft\s*$/i,
     'kenmerk_check'],
    // "indien [attribute] [operator]" (simplest form)
    [/^indien\s+(.+?)\s+(gelijk\s+is\s+aan|groter\s+is\s+dan|groter\s+of\s+gelijk\s+is\s+aan|kleiner\s+is\s+dan|kleiner\s+of\s+gelijk\s+is\s+aan|ongelijk\s+is\s+aan)\s*$/i,
     'bare_attribute'],
  ];

  // Result patterns
  private static readonly RESULT_PATTERNS: Array<[RegExp, string]> = [
    // "de [attribute] van een [object] moet gesteld worden op"
    [/^de\s+(.+?)\s+van\s+(?:een|de|het)\s+(.+?)\s+moet\s+(?:gesteld\s+worden\s+op|berekend\s+worden\s+als)\s*$/i,
     'attribute_assignment'],
    // "de [attribute] van [object] moet gesteld worden op" (named object)
    [/^de\s+(.+?)\s+van\s+(.+?)\s+moet\s+(?:gesteld\s+worden\s+op|berekend\s+worden\s+als)\s*$/i,
     'named_object_attribute'],
    // "de [attribute] moet gesteld worden op"
    [/^(?:de|het)\s+(.+?)\s+moet\s+(?:gesteld\s+worden\s+op|berekend\s+worden\s+als)\s*$/i,
     'simple_attribute_assignment'],
    // "een [object] is [kenmerk]"
    [/^een\s+(.+?)\s+is\s+(?:een\s+)?(.+?)\s*$/i,
     'kenmerk_assignment'],
    // "[object] is [kenmerk]" (without "een")
    [/^(.+?)\s+is\s+(?:een\s+)?(.+?)\s*$/i,
     'simple_kenmerk_assignment'],
  ];

  // Operator mapping
  private static readonly OPERATOR_MAP: Record<string, string> = {
    'gelijk is aan': '==',
    'is': '==',
    'groter is dan': '>',
    'groter of gelijk is aan': '>=',
    'kleiner is dan': '<',
    'kleiner of gelijk is aan': '<=',
    'ongelijk is aan': '!=',
  };

  /**
   * Parse a condition column header into a structured form
   */
  parseConditionColumn(headerText: string): ParsedCondition | null {
    const cleaned = headerText.trim();
    
    for (const [pattern, patternType] of DecisionTableHeaderParser.CONDITION_PATTERNS) {
      const match = cleaned.match(pattern);
      if (match) {
        switch (patternType) {
          case 'simple_attribute':
            // "indien zijn leeftijd groter is dan"
            return {
              subjectExpression: this.createAttributeReference(match[1].trim()),
              operator: DecisionTableHeaderParser.OPERATOR_MAP[match[2].toLowerCase().trim()] || '==',
              isKenmerkCheck: false
            };
            
          case 'attribute_of_object':
            // "indien de reisduur van zijn reis groter is dan"
            return {
              subjectExpression: this.createNavigationReference(
                match[1].trim(), // attribute
                match[2].trim()  // object
              ),
              operator: DecisionTableHeaderParser.OPERATOR_MAP[match[3].toLowerCase().trim()] || '==',
              isKenmerkCheck: false
            };
            
          case 'attribute_of_named_object':
            // "indien de leeftijd van passagier groter is dan"
            return {
              subjectExpression: this.createNavigationReference(
                match[1].trim(), // attribute
                match[2].trim()  // object name
              ),
              operator: DecisionTableHeaderParser.OPERATOR_MAP[match[3].toLowerCase().trim()] || '==',
              isKenmerkCheck: false
            };
            
          case 'kenmerk_check':
            // "indien hij een recht op duurzaamheidskorting heeft"
            const kenmerkName = match[1].trim();
            return {
              subjectExpression: this.createKenmerkReference(kenmerkName),
              operator: '==', // Kenmerk checks are always equality
              isKenmerkCheck: true,
              kenmerkName
            };
            
          case 'bare_attribute':
            // "indien leeftijd groter is dan"
            return {
              subjectExpression: this.createAttributeReference(match[1].trim()),
              operator: DecisionTableHeaderParser.OPERATOR_MAP[match[2].toLowerCase().trim()] || '==',
              isKenmerkCheck: false
            };
        }
      }
    }
    
    return null;
  }

  /**
   * Parse a result column header into a structured form
   */
  parseResultColumn(headerText: string): ParsedResult | null {
    const cleaned = headerText.trim();
    
    for (const [pattern, patternType] of DecisionTableHeaderParser.RESULT_PATTERNS) {
      const match = cleaned.match(pattern);
      if (match) {
        switch (patternType) {
          case 'attribute_assignment':
            // "de woonregio factor van een Natuurlijk persoon moet gesteld worden op"
            return {
              targetType: 'attribute',
              targetExpression: this.createNavigationReference(
                match[1].trim(), // attribute
                match[2].trim()  // object type
              )
            };
            
          case 'named_object_attribute':
            // "de belasting van passagier moet gesteld worden op"
            return {
              targetType: 'attribute',
              targetExpression: this.createNavigationReference(
                match[1].trim(), // attribute
                match[2].trim()  // object name
              )
            };
            
          case 'simple_attribute_assignment':
            // "de belasting moet gesteld worden op"
            return {
              targetType: 'attribute',
              targetExpression: this.createAttributeReference(match[1].trim())
            };
            
          case 'kenmerk_assignment':
            // "een passagier is een passagier jonger dan 18 jaar"
            return {
              targetType: 'kenmerk',
              targetExpression: this.createVariableReference(match[1].trim()),
              kenmerkName: match[2].trim()
            };
            
          case 'simple_kenmerk_assignment':
            // "passagier is minderjarig"
            return {
              targetType: 'kenmerk',
              targetExpression: this.createVariableReference(match[1].trim()),
              kenmerkName: match[2].trim()
            };
        }
      }
    }
    
    return null;
  }

  private createAttributeReference(attributeName: string): AttributeReference {
    // Clean attribute name - remove articles and convert to path
    const cleaned = attributeName
      .replace(/^(de|het|een)\s+/i, '')
      .trim();
    
    // Convert spaces to underscores for multi-word attributes
    const path = cleaned.split(/\s+/).map(word => word.toLowerCase());
    
    return {
      type: 'AttributeReference',
      path: path.length === 1 ? [path[0]] : [path.join('_')]
    };
  }

  private createNavigationReference(attributeName: string, objectName: string): AttributeReference {
    // Clean names
    const cleanedAttribute = attributeName
      .replace(/^(de|het|een)\s+/i, '')
      .trim()
      .replace(/\s+/g, '_')
      .toLowerCase();

    const cleanedObject = objectName
      .replace(/^(zijn|haar|hun|de|het|een)\s+/i, '')
      .trim()
      .replace(/\s+/g, '_')
      .toLowerCase();

    // Create AttributeReference with object-first path order
    return {
      type: 'AttributeReference',
      path: [cleanedObject, cleanedAttribute]
    };
  }

  private createVariableReference(name: string): VariableReference {
    // Clean and normalize the variable name
    const cleaned = name
      .replace(/^(de|het|een)\s+/i, '')
      .trim()
      .replace(/\s+/g, '_')
      .toLowerCase();
    
    return {
      type: 'VariableReference',
      variableName: cleaned
    };
  }

  private createKenmerkReference(kenmerkName: string): Expression {
    // For kenmerk checks, we create an attribute reference
    // The actual kenmerk will be resolved during evaluation
    return {
      type: 'AttributeReference',
      path: ['heeft_' + kenmerkName.replace(/\s+/g, '_').toLowerCase()]
    } as AttributeReference;
  }
}