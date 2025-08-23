/**
 * Dimension coordinate model for RegelSpraak
 * Provides model-driven dimension resolution and range filtering
 */

import { Dimension, DimensionLabel } from '../ast/dimensions';

/**
 * Represents a dimension axis with ordered labels
 */
export interface DimensionAxis {
  name: string;
  labels: string[];
  usageStyle: 'prepositional' | 'adjectival';
  preposition?: string;
}

/**
 * Represents a specific coordinate on a dimension axis
 */
export interface DimensionCoordinate {
  axis: string;
  label: string;
  position: number;
}

/**
 * Represents a range on a dimension axis
 */
export interface DimensionRange {
  axis: string;
  from: string;
  to: string;
}

/**
 * Registry for managing dimension definitions and operations
 */
export class DimensionRegistry {
  private axes: Map<string, DimensionAxis> = new Map();
  private labelToPosition: Map<string, Map<string, number>> = new Map();

  /**
   * Register a dimension definition from the model
   */
  register(dimension: Dimension): void {
    // Create axis from dimension
    const axis: DimensionAxis = {
      name: dimension.name,
      labels: dimension.labels.map(l => l.label),
      usageStyle: dimension.usageStyle,
      preposition: dimension.preposition
    };
    
    this.axes.set(dimension.name, axis);
    
    // Build label position index
    const positionMap = new Map<string, number>();
    dimension.labels.forEach((label: DimensionLabel) => {
      positionMap.set(label.label, label.position);
    });
    this.labelToPosition.set(dimension.name, positionMap);
  }

  /**
   * Get a dimension axis by name
   */
  getAxis(name: string): DimensionAxis | undefined {
    return this.axes.get(name);
  }

  /**
   * Get all registered dimension axes
   */
  getAllAxes(): DimensionAxis[] {
    return Array.from(this.axes.values());
  }

  /**
   * Get the position of a label on an axis
   */
  getLabelPosition(axis: string, label: string): number {
    const positionMap = this.labelToPosition.get(axis);
    if (!positionMap) {
      return -1;
    }
    return positionMap.get(label) ?? -1;
  }

  /**
   * Get all labels within a range on an axis (inclusive)
   */
  getLabelsInRange(axis: string, from: string, to: string): string[] {
    const dimensionAxis = this.axes.get(axis);
    if (!dimensionAxis) {
      return [];
    }

    const fromPos = this.getLabelPosition(axis, from);
    const toPos = this.getLabelPosition(axis, to);
    
    if (fromPos === -1 || toPos === -1) {
      return [];
    }

    const minPos = Math.min(fromPos, toPos);
    const maxPos = Math.max(fromPos, toPos);

    const result: string[] = [];
    const positionMap = this.labelToPosition.get(axis)!;
    
    for (const [label, position] of positionMap.entries()) {
      if (position >= minPos && position <= maxPos) {
        result.push(label);
      }
    }

    // Sort by position to maintain order
    result.sort((a, b) => {
      const posA = this.getLabelPosition(axis, a);
      const posB = this.getLabelPosition(axis, b);
      return posA - posB;
    });

    return result;
  }

  /**
   * Check if a label is valid for a given axis
   */
  isValidLabel(axis: string, label: string): boolean {
    const positionMap = this.labelToPosition.get(axis);
    if (!positionMap) {
      return false;
    }
    return positionMap.has(label);
  }

  /**
   * Find which dimension axis contains a given label
   * Returns the axis name or undefined if not found
   */
  findAxisForLabel(label: string): string | undefined {
    for (const [axisName, positionMap] of this.labelToPosition.entries()) {
      if (positionMap.has(label)) {
        return axisName;
      }
    }
    return undefined;
  }

  /**
   * Check if a dimension uses prepositional style
   */
  isPrepositional(axis: string): boolean {
    const dimensionAxis = this.axes.get(axis);
    return dimensionAxis?.usageStyle === 'prepositional';
  }

  /**
   * Check if a dimension uses adjectival style
   */
  isAdjectival(axis: string): boolean {
    const dimensionAxis = this.axes.get(axis);
    return dimensionAxis?.usageStyle === 'adjectival';
  }

  /**
   * Get the preposition for a prepositional dimension
   */
  getPreposition(axis: string): string | undefined {
    const dimensionAxis = this.axes.get(axis);
    return dimensionAxis?.preposition;
  }
}