import { AntlrParser } from './antlr-parser';
import { DomainModel } from '../ast/domain-model';

/**
 * Extracts symbols (parameters, domains, etc.) from RegelSpraak source
 * 
 * This is the simplest possible approach:
 * 1. Parse the document
 * 2. Walk the AST
 * 3. Extract names
 * 
 * No caching, no incremental updates. Parse errors return empty symbols.
 * Good enough for autocomplete.
 */

export interface ExtractedSymbols {
  parameters: string[];
  domains: Record<string, string[]>;  // domain name -> values
  objectTypes: Record<string, string[]>;  // type name -> attributes
  units: string[];  // unit names and abbreviations
}

export class SymbolExtractor {
  private parser: AntlrParser;

  constructor() {
    this.parser = new AntlrParser();
  }

  extractSymbols(source: string): ExtractedSymbols {
    try {
      // Parse the source - this will throw on errors
      const model = this.parser.parseModel(source);
      return this.extractFromModel(model);
    } catch (error) {
      // Parse error - try to extract what we can from partial parse
      return this.extractFromPartialParse(source);
    }
  }

  private extractFromModel(model: DomainModel): ExtractedSymbols {
    const symbols: ExtractedSymbols = {
      parameters: [],
      domains: {},
      objectTypes: {},
      units: []
    };

    // Extract parameter names
    for (const param of model.parameters) {
      if (param.name) {
        symbols.parameters.push(param.name);
      }
    }

    // Note: Domains in the AST are just references, not definitions
    // The actual domain values aren't parsed into the AST yet
    // TODO: Parse domain definitions when that's implemented

    // Extract object type attributes
    for (const objectType of model.objectTypes) {
      if (objectType.name && objectType.members) {
        const attributes: string[] = [];
        for (const member of objectType.members) {
          if (member.name) {
            attributes.push(member.name);
          }
        }
        symbols.objectTypes[objectType.name.toLowerCase()] = attributes;
      }
    }

    // Extract units from unit systems
    for (const unitSystem of model.unitSystems) {
      for (const unit of unitSystem.units) {
        if (unit.name) symbols.units.push(unit.name);
        if (unit.plural) symbols.units.push(unit.plural);
        if (unit.abbreviation) symbols.units.push(unit.abbreviation);
        if (unit.symbol) symbols.units.push(unit.symbol);
      }
    }

    // Deduplicate units
    symbols.units = [...new Set(symbols.units)];

    return symbols;
  }

  /**
   * Extract symbols from partial/invalid parse
   * This is more forgiving and extracts what it can
   */
  private extractFromPartialParse(source: string): ExtractedSymbols {
    const symbols: ExtractedSymbols = {
      parameters: [],
      domains: {},
      objectTypes: {},
      units: []
    };

    // Use simple regex patterns to extract parameter names
    // Pattern: Parameter <name>: <type>;
    const paramPattern = /^\s*Parameter\s+(\w+)\s*:/gm;
    let match;
    while ((match = paramPattern.exec(source)) !== null) {
      const paramName = match[1].toLowerCase();
      if (!symbols.parameters.includes(paramName)) {
        symbols.parameters.push(paramName);
      }
    }

    // Extract domain names and values
    // Pattern: Domein <name> { ... }
    const domainPattern = /^\s*Domein\s+(\w+)\s*\{([^}]*)\}/gm;
    while ((match = domainPattern.exec(source)) !== null) {
      const domainName = match[1].toLowerCase();
      const domainContent = match[2];

      // Extract domain values (simple string literals)
      const valuePattern = /'([^']+)'/g;
      const values: string[] = [];
      let valueMatch;
      while ((valueMatch = valuePattern.exec(domainContent)) !== null) {
        values.push(valueMatch[1]);
      }

      if (values.length > 0) {
        symbols.domains[domainName] = values;
      }
    }

    // Extract object type names
    // Pattern: Objecttype <name> { ... }
    const objectPattern = /^\s*Objecttype\s+(\w+)/gm;
    while ((match = objectPattern.exec(source)) !== null) {
      const typeName = match[1].toLowerCase();
      symbols.objectTypes[typeName] = []; // We won't extract attributes in partial parse
    }

    // Extract unit names, plurals, and abbreviations
    // Pattern: (de|het) <name> (<plural>) <abbrev>
    const unitPattern = /^\s*(?:de|het)\s+(\w+)(?:\s+\((\w+)\))?\s+(\w+)/gm;
    while ((match = unitPattern.exec(source)) !== null) {
      const name = match[1].toLowerCase();
      const plural = match[2] ? match[2].toLowerCase() : null;
      const abbrev = match[3].toLowerCase();

      if (!symbols.units.includes(name)) symbols.units.push(name);
      if (plural && !symbols.units.includes(plural)) symbols.units.push(plural);
      if (!symbols.units.includes(abbrev)) symbols.units.push(abbrev);
    }

    return symbols;
  }

  /**
   * Quick check if a name exists as a parameter
   */
  isParameter(source: string, name: string): boolean {
    const symbols = this.extractSymbols(source);
    return symbols.parameters.includes(name);
  }

  /**
   * Get domain values for a specific domain
   */
  getDomainValues(source: string, domainName: string): string[] {
    const symbols = this.extractSymbols(source);
    return symbols.domains[domainName.toLowerCase()] || [];
  }
}