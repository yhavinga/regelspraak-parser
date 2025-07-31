/**
 * Domain model - the root AST node containing all parsed RegelSpraak elements
 */

import { ObjectTypeDefinition } from './object-types';
import { ParameterDefinition } from './parameters';
import { Rule, RegelGroep } from './rules';
import { DecisionTable } from './decision-tables';
import { Dimension } from './dimensions';
import { DagsoortDefinitie } from './dagsoort';
import { DomainReference } from './object-types';
import { UnitSystemDefinition } from './unit-systems';

export interface DomainModel {
  objectTypes: ObjectTypeDefinition[];
  parameters: ParameterDefinition[];
  regels: Rule[];
  regelGroepen: RegelGroep[];
  beslistabels: DecisionTable[];
  dimensions: Dimension[];
  dagsoortDefinities: DagsoortDefinitie[];
  domains: DomainReference[];
  feitTypes: any[]; // TODO: Define FeitType interface when implemented
  unitSystems: UnitSystemDefinition[];
}