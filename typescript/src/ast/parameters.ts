import { DataType, DomainReference } from './object-types';

/**
 * Parameter definition
 */
export interface ParameterDefinition {
  type: 'ParameterDefinition';
  name: string;
  dataType: DataType | DomainReference;
  unit?: string;
  timeline?: boolean;
}