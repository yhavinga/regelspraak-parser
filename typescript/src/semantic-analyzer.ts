import { DomainModel } from './ast/domain-model';
import { ObjectTypeDefinition, AttributeSpecification, KenmerkSpecification } from './ast/object-types';
import { ParameterDefinition } from './ast/parameters';
import { Rule, RegelGroep, Gelijkstelling, Kenmerktoekenning, ObjectCreation } from './ast/rules';
import {
  Expression,
  Literal,
  AttributeReference,
  VariableReference,
  ParameterReference,
  BinaryExpression,
  UnaryExpression,
  FunctionCall,
  SubselectieExpression
} from './ast/expressions';
import { DecisionTable } from './ast/decision-tables';
import { Dimension } from './ast/dimensions';
import { DagsoortDefinitie } from './ast/dagsoort';

export interface ValidationError {
  message: string;
  location?: any;
  severity: 'error' | 'warning';
}

export enum SymbolKind {
  PARAMETER = 'parameter',
  OBJECT_TYPE = 'object_type',
  ATTRIBUTE = 'attribute',
  KENMERK = 'kenmerk',
  VARIABLE = 'variable',
  RULE = 'rule',
  REGELGROEP = 'regelgroep',
  DOMAIN = 'domain',
  FEITTYPE = 'feittype',
  DIMENSION = 'dimension',
  DAGSOORT = 'dagsoort'
}

export interface Symbol {
  name: string;
  kind: SymbolKind;
  datatype?: string;
  definition: any;
}

export class SymbolTable {
  private symbols: Map<string, Symbol> = new Map();
  private parent?: SymbolTable;

  constructor(parent?: SymbolTable) {
    this.parent = parent;
  }

  define(name: string, symbol: Symbol): void {
    this.symbols.set(name, symbol);
  }

  lookup(name: string): Symbol | undefined {
    const localSymbol = this.symbols.get(name);
    if (localSymbol) return localSymbol;
    return this.parent?.lookup(name);
  }

  lookupLocal(name: string): Symbol | undefined {
    return this.symbols.get(name);
  }
}

export class SemanticAnalyzer {
  private errors: ValidationError[] = [];
  private globalScope: SymbolTable = new SymbolTable();
  private currentScope: SymbolTable = this.globalScope;
  private objectTypes: Map<string, ObjectTypeDefinition> = new Map();
  private parameters: Map<string, ParameterDefinition> = new Map();
  private dimensions: Map<string, Dimension> = new Map();

  analyze(model: DomainModel): ValidationError[] {
    this.errors = [];
    this.globalScope = new SymbolTable();
    this.currentScope = this.globalScope;
    this.objectTypes.clear();
    this.parameters.clear();
    this.dimensions.clear();

    // First pass: collect all definitions
    this.collectDefinitions(model);

    // Second pass: validate references and type checking
    this.validateModel(model);

    return this.errors;
  }

  private collectDefinitions(model: DomainModel): void {
    // Collect parameters
    for (const param of model.parameters || []) {
      this.parameters.set(param.name, param);
      this.globalScope.define(param.name, {
        name: param.name,
        kind: SymbolKind.PARAMETER,
        datatype: typeof param.dataType === 'object' && 'typeName' in param.dataType ? 
                  (param.dataType as any).typeName : 
                  typeof param.dataType === 'object' && 'domain' in param.dataType ? 
                  (param.dataType as any).domain : 
                  undefined,
        definition: param
      });
    }

    // Collect object types and their attributes/kenmerken
    for (const objectType of model.objectTypes || []) {
      this.objectTypes.set(objectType.name, objectType);
      this.globalScope.define(objectType.name, {
        name: objectType.name,
        kind: SymbolKind.OBJECT_TYPE,
        definition: objectType
      });

      // Create a scope for the object type
      const objectScope = new SymbolTable(this.globalScope);
      
      // Add attributes and kenmerken from members
      for (const member of objectType.members) {
        if (member.type === 'AttributeSpecification') {
          const attr = member as AttributeSpecification;
          objectScope.define(attr.name, {
            name: attr.name,
            kind: SymbolKind.ATTRIBUTE,
            datatype: this.getDataTypeString(attr.dataType),
            definition: attr
          });
        } else if (member.type === 'KenmerkSpecification') {
          const kenmerk = member as KenmerkSpecification;
          objectScope.define(kenmerk.name, {
            name: kenmerk.name,
            kind: SymbolKind.KENMERK,
            datatype: 'Boolean',
            definition: kenmerk
          });
        }
      }
    }

    // Collect dimensions
    for (const dimension of model.dimensions || []) {
      this.dimensions.set(dimension.name, dimension);
      this.globalScope.define(dimension.name, {
        name: dimension.name,
        kind: SymbolKind.DIMENSION,
        definition: dimension
      });
    }

    // Collect rules
    for (const regel of model.regels || []) {
      const ruleName = regel.name || regel.naam;
      if (ruleName) {
        this.globalScope.define(ruleName, {
          name: ruleName,
          kind: SymbolKind.RULE,
          definition: regel
        });
      }
    }

    // Collect rule groups
    for (const regelGroep of model.regelGroepen || []) {
      this.globalScope.define(regelGroep.name, {
        name: regelGroep.name,
        kind: SymbolKind.REGELGROEP,
        definition: regelGroep
      });
    }

    // Collect dagsoort definitions
    for (const dagsoort of model.dagsoortDefinities || []) {
      this.globalScope.define(dagsoort.dagsoortName, {
        name: dagsoort.dagsoortName,
        kind: SymbolKind.DAGSOORT,
        definition: dagsoort
      });
    }
  }

  private validateModel(model: DomainModel): void {
    // Validate rules
    for (const regel of model.regels || []) {
      this.validateRegel(regel);
    }

    // Validate rule groups
    for (const regelGroep of model.regelGroepen || []) {
      for (const regel of regelGroep.rules) {
        this.validateRegel(regel);
      }
    }

    // Validate decision tables
    for (const beslistabel of model.beslistabels || []) {
      this.validateBeslistabel(beslistabel);
    }
  }

  private validateRegel(regel: Rule): void {
    // Check if regel has a result property with the actual rule content
    if ('result' in regel && regel.result) {
      const result = regel.result;
      if (result.type === 'Gelijkstelling') {
        this.validateGelijkstelling(result as Gelijkstelling);
      } else if (result.type === 'Kenmerktoekenning') {
        this.validateKenmerkToekenning(result as Kenmerktoekenning);
      } else if (result.type === 'ObjectCreation') {
        this.validateObjectCreatie(result as ObjectCreation);
      }
    }
  }

  private validateGelijkstelling(regel: Gelijkstelling): void {
    // Validate target exists and expression type matches
    if (regel.target.type === 'AttributeReference') {
      const attrRef = regel.target as AttributeReference;
      this.validateAttributeReference(attrRef);
    }
    
    // Validate expression
    if (regel.expression) {
      this.validateExpression(regel.expression);
    }
  }

  private validateKenmerkToekenning(regel: Kenmerktoekenning): void {
    // Validate kenmerk exists on the object type
    // The subject is an Expression, typically a VariableReference with the object type name
    let objectTypeName: string | undefined;
    
    
    if (regel.subject.type === 'VariableReference') {
      const varRef = regel.subject as VariableReference;
      objectTypeName = varRef.variableName;
    } else if (regel.subject.type === 'AttributeReference') {
      // Handle "Een Persoon" which might be parsed as AttributeReference
      const attrRef = regel.subject as AttributeReference;
      if (attrRef.path.length === 1) {
        objectTypeName = attrRef.path[0];
      }
    } else {
      // Handle other expression types if needed
      this.addError(`Complex subject expressions in kenmerk assignment not yet supported (got ${regel.subject.type})`);
      return;
    }
    
    const kenmerkName = regel.characteristic;
    
    const objectType = this.objectTypes.get(objectTypeName || '');
    if (!objectType && objectTypeName) {
      this.addError(`Unknown object type: ${objectTypeName}`);
      return;
    }

    const kenmerk = objectType?.members.find(m => 
      m.type === 'KenmerkSpecification' && m.name === kenmerkName
    ) as KenmerkSpecification | undefined;
    if (!kenmerk) {
      this.addError(`Kenmerk '${kenmerkName}' not defined for object type '${objectTypeName}'`);
    }

    // Validate condition if present
    if ('condition' in regel && regel.condition) {
      this.validateExpression(regel.condition as Expression);
    }
  }

  private validateObjectCreatie(regel: ObjectCreation): void {
    // Validate object type exists
    const objectTypeName = regel.objectType;
    const objectType = this.objectTypes.get(objectTypeName);
    
    if (!objectType) {
      this.addError(`Unknown object type: ${objectTypeName}`);
      return;
    }

    // Validate attributes being initialized
    for (const init of regel.attributeInits) {
      const attr = objectType.members.find(m => m.type === 'AttributeSpecification' && m.name === init.attribute) as AttributeSpecification | undefined;
      if (!attr) {
        this.addError(`Attribute '${init.attribute}' not defined for object type '${objectTypeName}'`);
      } else {
        // Validate type of initialization value
        if (init.value) {
          const valueType = this.getExpressionType(init.value);
          const attrType = this.getDataTypeString(attr.dataType);
          if (!this.isTypeCompatible(valueType, attrType)) {
            this.addError(`Type mismatch: cannot assign ${valueType} to attribute '${init.attribute}' of type ${attrType}`);
          }
        }
      }
    }
  }

  private validateBeslistabel(beslistabel: DecisionTable): void {
    // Validate expressions in decision table
    for (const row of beslistabel.rows) {
      if ('result' in row && row.result) {
        this.validateExpression((row as any).result);
      }
    }
  }

  private validateAttributeReference(attrRef: AttributeReference): void {
    // Validate attribute path
    if (attrRef.path.length === 0) {
      this.addError('Empty attribute reference path');
      return;
    }

    // Complex path validation would go here
    // For now, just check if the attribute exists on known object types
  }

  private validateExpression(expr: Expression): void {
    switch (expr.type) {
      case 'Literal':
        // Literals are always valid
        break;
      
      case 'AttributeReference':
        this.validateAttributeReference(expr as AttributeReference);
        break;

      case 'ParameterReference':
        // Validate parameter exists in domain model
        const paramRef = expr as ParameterReference;
        if (!this.parameters.has(paramRef.parameterName)) {
          this.addError(`Undefined parameter: ${paramRef.parameterName}`);
        }
        break;

      case 'VariableReference':
        // Variables are rule-scoped, defined in waar blocks
        const varRef = expr as VariableReference;
        const varName = varRef.variableName;
        
        // Check if it's a parameter reference
        if (!this.parameters.has(varName) && !this.objectTypes.has(varName)) {
          // It's not a known parameter or object type
          this.addError(`Unknown parameter: ${varName}`);
        }
        break;
      
      case 'BinaryExpression':
        const binExpr = expr as BinaryExpression;
        this.validateExpression(binExpr.left);
        this.validateExpression(binExpr.right);
        // Type checking for operators would go here
        break;
      
      case 'UnaryExpression':
        const unExpr = expr as UnaryExpression;
        this.validateExpression(unExpr.operand);
        break;
      
      case 'FunctionCall':
        const funcCall = expr as FunctionCall;
        // Validate function exists and arguments
        for (const arg of funcCall.arguments) {
          this.validateExpression(arg);
        }
        break;
      
      case 'SubselectieExpression':
        const subselectie = expr as SubselectieExpression;
        this.validateExpression(subselectie.collection);
        // Validate predicate would go here
        break;
    }
  }

  private getExpressionType(expr: Expression): string {
    switch (expr.type) {
      case 'Literal':
        const lit = expr as Literal;
        switch ((lit as any).literalType) {
          case 'number': return 'Numeriek';
          case 'string': return 'Tekst';
          case 'boolean': return 'Boolean';
          case 'date': return 'Datum';
          default: return 'Unknown';
        }
      
      case 'NumberLiteral':
        return 'Numeriek';
      
      case 'StringLiteral':
        return 'Tekst';
      
      case 'BooleanLiteral':
        return 'Boolean';
      
      case 'AttributeReference':
        // Would need to resolve attribute type
        return 'Unknown';

      case 'ParameterReference':
        // Look up parameter type from definitions
        const pRef = expr as ParameterReference;
        const paramDef = this.parameters.get(pRef.parameterName);
        if (paramDef) {
          return this.getDataTypeString(paramDef.dataType);
        }
        return 'Unknown';

      case 'BinaryExpression':
        const binExpr = expr as BinaryExpression;
        // Comparison operators return boolean
        if (['<', '>', '<=', '>=', '==', '!='].includes(binExpr.operator)) {
          return 'Boolean';
        }
        // Arithmetic operators return numeric
        if (['+', '-', '*', '/', '^'].includes(binExpr.operator)) {
          return 'Numeriek';
        }
        // Logical operators return boolean
        if (['AND', 'OR'].includes(binExpr.operator)) {
          return 'Boolean';
        }
        return 'Unknown';
      
      case 'FunctionCall':
        // Would need function return type registry
        return 'Unknown';
      
      default:
        return 'Unknown';
    }
  }

  private isTypeCompatible(sourceType: string, targetType: string): boolean {
    // Simple type compatibility check
    if (sourceType === targetType) return true;
    if (sourceType === 'Unknown' || targetType === 'Unknown') return true;
    
    // Numeriek variations are compatible
    if (sourceType.startsWith('Numeriek') && targetType.startsWith('Numeriek')) {
      return true;
    }
    
    // Add more compatibility rules as needed
    return false;
  }

  private getDataTypeString(dataType: any): string {
    if ('domain' in dataType) {
      return dataType.domain;
    }
    switch (dataType.type) {
      case 'Tekst': return 'Tekst';
      case 'Numeriek': return dataType.specification ? `Numeriek(${dataType.specification})` : 'Numeriek';
      case 'Boolean': return 'Boolean';
      case 'Datum': return 'Datum';
      case 'DatumTijd': return 'DatumTijd';
      default: return 'Unknown';
    }
  }

  private addError(message: string, severity: 'error' | 'warning' = 'error'): void {
    this.errors.push({ message, severity });
  }
}