/**
 * AST nodes for RegelSpraak dagsoort (day type) definitions
 */

import { Expression } from './expressions';

export interface Dagsoort {
  type: 'Dagsoort';
  name: string;
  plural?: string;
}

export interface DagsoortDefinitie {
  type: 'DagsoortDefinitie';
  dagsoortName: string;
  condition?: Expression;
}