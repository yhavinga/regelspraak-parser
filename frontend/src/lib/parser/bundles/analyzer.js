var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/semantic-analyzer.ts
var SymbolKind = /* @__PURE__ */ ((SymbolKind2) => {
  SymbolKind2["PARAMETER"] = "parameter";
  SymbolKind2["OBJECT_TYPE"] = "object_type";
  SymbolKind2["ATTRIBUTE"] = "attribute";
  SymbolKind2["KENMERK"] = "kenmerk";
  SymbolKind2["VARIABLE"] = "variable";
  SymbolKind2["RULE"] = "rule";
  SymbolKind2["REGELGROEP"] = "regelgroep";
  SymbolKind2["DOMAIN"] = "domain";
  SymbolKind2["FEITTYPE"] = "feittype";
  SymbolKind2["DIMENSION"] = "dimension";
  SymbolKind2["DAGSOORT"] = "dagsoort";
  return SymbolKind2;
})(SymbolKind || {});
var SymbolTable = class {
  constructor(parent) {
    __publicField(this, "symbols", /* @__PURE__ */ new Map());
    __publicField(this, "parent");
    this.parent = parent;
  }
  define(name, symbol) {
    this.symbols.set(name, symbol);
  }
  lookup(name) {
    const localSymbol = this.symbols.get(name);
    if (localSymbol)
      return localSymbol;
    return this.parent?.lookup(name);
  }
  lookupLocal(name) {
    return this.symbols.get(name);
  }
};
var SemanticAnalyzer = class {
  constructor() {
    __publicField(this, "errors", []);
    __publicField(this, "globalScope", new SymbolTable());
    __publicField(this, "currentScope", this.globalScope);
    __publicField(this, "objectTypes", /* @__PURE__ */ new Map());
    __publicField(this, "parameters", /* @__PURE__ */ new Map());
    __publicField(this, "dimensions", /* @__PURE__ */ new Map());
  }
  analyze(model) {
    this.errors = [];
    this.globalScope = new SymbolTable();
    this.currentScope = this.globalScope;
    this.objectTypes.clear();
    this.parameters.clear();
    this.dimensions.clear();
    this.collectDefinitions(model);
    this.validateModel(model);
    return this.errors;
  }
  collectDefinitions(model) {
    for (const param of model.parameters || []) {
      this.parameters.set(param.name, param);
      this.globalScope.define(param.name, {
        name: param.name,
        kind: "parameter" /* PARAMETER */,
        datatype: param.datatype,
        definition: param
      });
    }
    for (const objectType of model.objectTypes || []) {
      this.objectTypes.set(objectType.name, objectType);
      this.globalScope.define(objectType.name, {
        name: objectType.name,
        kind: "object_type" /* OBJECT_TYPE */,
        definition: objectType
      });
      const objectScope = new SymbolTable(this.globalScope);
      for (const member of objectType.members) {
        if (member.type === "AttributeSpecification") {
          const attr = member;
          objectScope.define(attr.name, {
            name: attr.name,
            kind: "attribute" /* ATTRIBUTE */,
            datatype: this.getDataTypeString(attr.dataType),
            definition: attr
          });
        } else if (member.type === "KenmerkSpecification") {
          const kenmerk = member;
          objectScope.define(kenmerk.name, {
            name: kenmerk.name,
            kind: "kenmerk" /* KENMERK */,
            datatype: "Boolean",
            definition: kenmerk
          });
        }
      }
    }
    for (const dimension of model.dimensions || []) {
      this.dimensions.set(dimension.name, dimension);
      this.globalScope.define(dimension.name, {
        name: dimension.name,
        kind: "dimension" /* DIMENSION */,
        definition: dimension
      });
    }
    for (const regel of model.regels || []) {
      this.globalScope.define(regel.name, {
        name: regel.name,
        kind: "rule" /* RULE */,
        definition: regel
      });
    }
    for (const regelGroep of model.regelGroepen || []) {
      this.globalScope.define(regelGroep.name, {
        name: regelGroep.name,
        kind: "regelgroep" /* REGELGROEP */,
        definition: regelGroep
      });
    }
    for (const dagsoort of model.dagsoortDefinities || []) {
      this.globalScope.define(dagsoort.name, {
        name: dagsoort.name,
        kind: "dagsoort" /* DAGSOORT */,
        definition: dagsoort
      });
    }
  }
  validateModel(model) {
    for (const regel of model.regels || []) {
      this.validateRegel(regel);
    }
    for (const regelGroep of model.regelGroepen || []) {
      for (const regel of regelGroep.regels) {
        this.validateRegel(regel);
      }
    }
    for (const beslistabel of model.beslistabels || []) {
      this.validateBeslistabel(beslistabel);
    }
  }
  validateRegel(regel) {
    if ("result" in regel && regel.result) {
      const result = regel.result;
      if (result.type === "Gelijkstelling") {
        this.validateGelijkstelling(result);
      } else if (result.type === "Kenmerktoekenning") {
        this.validateKenmerkToekenning(result);
      } else if (result.type === "ObjectCreation") {
        this.validateObjectCreatie(result);
      }
    }
  }
  validateGelijkstelling(regel) {
    if (regel.target.type === "AttributeReference") {
      const attrRef = regel.target;
      this.validateAttributeReference(attrRef);
    }
    if (regel.expression) {
      this.validateExpression(regel.expression);
    }
  }
  validateKenmerkToekenning(regel) {
    let objectTypeName;
    if (regel.subject.type === "VariableReference") {
      const varRef = regel.subject;
      objectTypeName = varRef.name || varRef.variableName;
    } else if (regel.subject.type === "NavigationExpression") {
      const navExpr = regel.subject;
      if (navExpr.base?.type === "VariableReference") {
        objectTypeName = navExpr.base.name;
      }
    } else {
      this.addError(`Complex subject expressions in kenmerk assignment not yet supported (got ${regel.subject.type})`);
      return;
    }
    const kenmerkName = regel.characteristic;
    const objectType = this.objectTypes.get(objectTypeName);
    if (!objectType) {
      this.addError(`Unknown object type: ${objectTypeName}`);
      return;
    }
    const kenmerk = objectType.members.find(
      (m) => m.type === "KenmerkSpecification" && m.name === kenmerkName
    );
    if (!kenmerk) {
      this.addError(`Kenmerk '${kenmerkName}' not defined for object type '${objectTypeName}'`);
    }
    if ("condition" in regel && regel.condition) {
      this.validateExpression(regel.condition);
    }
  }
  validateObjectCreatie(regel) {
    const objectTypeName = regel.objectType;
    const objectType = this.objectTypes.get(objectTypeName);
    if (!objectType) {
      this.addError(`Unknown object type: ${objectTypeName}`);
      return;
    }
    for (const init of regel.attributeInits) {
      const attr = objectType.members.find((m) => m.type === "AttributeSpecification" && m.name === init.attribute);
      if (!attr) {
        this.addError(`Attribute '${init.attribute}' not defined for object type '${objectTypeName}'`);
      } else {
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
  // TODO: Implement FeitCreatie validation when visitor supports it
  validateBeslistabel(beslistabel) {
    for (const row of beslistabel.rows) {
      if (row.result) {
        this.validateExpression(row.result);
      }
    }
  }
  validateAttributeReference(attrRef) {
    if (attrRef.path.length === 0) {
      this.addError("Empty attribute reference path");
      return;
    }
  }
  validateExpression(expr) {
    switch (expr.type) {
      case "Literal":
        break;
      case "AttributeReference":
        this.validateAttributeReference(expr);
        break;
      case "ParameterReference":
        const paramRef = expr;
        const paramName = paramRef.name || paramRef.parameterName;
        if (!this.parameters.has(paramName)) {
          this.addError(`Unknown parameter: ${paramName}`);
        }
        break;
      case "VariableReference":
        const varRef = expr;
        const varName = varRef.name || varRef.variableName;
        if (!this.parameters.has(varName) && !this.objectTypes.has(varName)) {
          this.addError(`Unknown parameter: ${varName}`);
        }
        break;
      case "BinaryExpression":
        const binExpr = expr;
        this.validateExpression(binExpr.left);
        this.validateExpression(binExpr.right);
        break;
      case "UnaryExpression":
        const unExpr = expr;
        this.validateExpression(unExpr.operand);
        break;
      case "FunctionCall":
        const funcCall = expr;
        for (const arg of funcCall.arguments) {
          this.validateExpression(arg);
        }
        break;
      case "SubselectieExpression":
        const subselectie = expr;
        this.validateExpression(subselectie.collection);
        break;
    }
  }
  getExpressionType(expr) {
    switch (expr.type) {
      case "Literal":
        const lit = expr;
        switch (lit.literalType) {
          case "number":
            return "Numeriek";
          case "string":
            return "Tekst";
          case "boolean":
            return "Boolean";
          case "date":
            return "Datum";
          default:
            return "Unknown";
        }
      case "NumberLiteral":
        return "Numeriek";
      case "StringLiteral":
        return "Tekst";
      case "BooleanLiteral":
        return "Boolean";
      case "AttributeReference":
        return "Unknown";
      case "ParameterReference":
        const paramRef = expr;
        const paramName = paramRef.name || paramRef.parameterName;
        const param = this.parameters.get(paramName);
        return param?.datatype || "Unknown";
      case "BinaryExpression":
        const binExpr = expr;
        if (["<", ">", "<=", ">=", "==", "!="].includes(binExpr.operator)) {
          return "Boolean";
        }
        if (["+", "-", "*", "/", "^"].includes(binExpr.operator)) {
          return "Numeriek";
        }
        if (["AND", "OR"].includes(binExpr.operator)) {
          return "Boolean";
        }
        return "Unknown";
      case "FunctionCall":
        return "Unknown";
      default:
        return "Unknown";
    }
  }
  isTypeCompatible(sourceType, targetType) {
    if (sourceType === targetType)
      return true;
    if (sourceType === "Unknown" || targetType === "Unknown")
      return true;
    if (sourceType.startsWith("Numeriek") && targetType.startsWith("Numeriek")) {
      return true;
    }
    return false;
  }
  getDataTypeString(dataType) {
    if ("domain" in dataType) {
      return dataType.domain;
    }
    switch (dataType.type) {
      case "Tekst":
        return "Tekst";
      case "Numeriek":
        return dataType.specification ? `Numeriek(${dataType.specification})` : "Numeriek";
      case "Boolean":
        return "Boolean";
      case "Datum":
        return "Datum";
      case "DatumTijd":
        return "DatumTijd";
      default:
        return "Unknown";
    }
  }
  addError(message, severity = "error") {
    this.errors.push({ message, severity });
  }
};
export {
  SemanticAnalyzer,
  SymbolKind,
  SymbolTable
};
//# sourceMappingURL=analyzer.js.map
