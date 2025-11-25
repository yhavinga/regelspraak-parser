/**
 * Tests for tijdsevenredig deel (time-proportional) functionality.
 * Based on specification section 7.3.2.
 */

import { AntlrParser } from '../../src/parsers/antlr-parser';
import { Context } from '../../src/runtime/context';
import { ExpressionEvaluator } from '../../src/evaluators/expression-evaluator';
import { RuleExecutor } from '../../src/executors/rule-executor';
import { TimelineValueImpl, Period, Timeline } from '../../src/ast/timelines';
import { Value } from '../../src/interfaces';

describe('Tijdsevenredig Deel Tests', () => {
  let context: Context;
  let evaluator: ExpressionEvaluator;
  
  beforeEach(() => {
    context = new Context();
    evaluator = new ExpressionEvaluator();
  });
  
  describe('Monthly Proportional Calculation', () => {
    it('should calculate tijdsevenredig deel per maand for full months (parsing test)', () => {
      const code = `
        Objecttype de Passagier
          de belastingvermindering Numeriek (getal met 2 decimalen) met eenheid € voor elke maand;
          het recht op belastingvermindering kenmerk (bezittelijk);

        Parameter de STANDAARD_BELASTINGVERMINDERING : Numeriek (getal met 2 decimalen) met eenheid € voor elk jaar

        Regel Belastingvermindering
          geldig altijd
          De belastingvermindering van een passagier moet gesteld worden op
          (het tijdsevenredig deel per maand van de STANDAARD_BELASTINGVERMINDERING).
      `;
      
      const parser = new AntlrParser();
      const parseResult = parser.parse(code);
      
      // The parser returns an array of definitions, extract rules
      const rules = Array.isArray(parseResult) 
        ? parseResult.filter((def: any) => def.type === 'Rule')
        : (parseResult.rules || []);
      
      if (!rules || rules.length === 0) {
        console.error('Parse result:', parseResult);
        throw new Error('Failed to parse code - no rules found');
      }
      const ast = { rules };
      
      // Set up parameter timeline (€12/year for 2024, €18/year for 2025)
      const paramPeriods: Period[] = [
        {
          startDate: new Date(2024, 0, 1),
          endDate: new Date(2025, 0, 1),
          value: { type: 'number', value: 12, unit: { name: '€' } }
        },
        {
          startDate: new Date(2025, 0, 1),
          endDate: new Date(2026, 0, 1),
          value: { type: 'number', value: 18, unit: { name: '€' } }
        }
      ];
      
      const paramTimeline = new TimelineValueImpl({
        periods: paramPeriods,
        granularity: 'jaar'
      });
      
      context.setTimelineParameter('STANDAARD_BELASTINGVERMINDERING', paramTimeline);
      
      // Create passagier object
      const passagier = {
        type: 'object' as const,
        objectType: 'Passagier',
        objectId: 'p1',
        value: {
          recht_op_belastingvermindering: { type: 'boolean' as const, value: true }
        }
      };
      
      context.createObject('Passagier', 'p1', passagier.value);
      context.current_instance = passagier;
      
      // Execute the rule
      const ruleExecutor = new RuleExecutor();
      const rule = ast.rules[0];
      const result = ruleExecutor.execute(rule, context);
      
      // Check results - should have monthly values
      // €12/year = €1/month for 2024
      // €18/year = €1.50/month for 2025
      
      
      context.evaluation_date = new Date(2024, 5, 15); // June 15, 2024
      const june2024 = context.getTimelineAttribute('Passagier', 'p1', 'belastingvermindering');
      expect(june2024?.value).toBeCloseTo(1.0, 2);
      
      context.evaluation_date = new Date(2025, 2, 15); // March 15, 2025
      const march2025 = context.getTimelineAttribute('Passagier', 'p1', 'belastingvermindering');
      expect(march2025?.value).toBeCloseTo(1.5, 2);
    });
    
    it('should calculate proportional value for partial months', () => {
      // Create a timeline with partial month period
      const periods: Period[] = [
        {
          startDate: new Date(2024, 0, 1),   // Jan 1
          endDate: new Date(2024, 0, 8),     // Jan 8 (7 days)
          value: { type: 'number', value: 31 } // Full month value
        }
      ];
      
      const timeline = new TimelineValueImpl({
        periods,
        granularity: 'maand'
      });
      
      // Test the timeline evaluator directly
      const timelineEvaluator = new (require('../../src/evaluators/timeline-evaluator').TimelineEvaluator)(evaluator);
      
      // Apply tijdsevenredig to the timeline
      const result = timelineEvaluator.applyTijdsevenredigToTimeline(
        timeline,
        'maand',
        undefined,
        context
      );
      
      // 7 days out of 31 in January = 7/31 * 31 ≈ 7
      expect(result.type).toBe('timeline');
      expect(result.value.periods[0].value.value).toBeCloseTo(7, 1);
    });
  });
  
  describe('Yearly Proportional Calculation', () => {
    it('should calculate tijdsevenredig deel per jaar for partial years', () => {
      // Create a timeline with partial year period
      const periods: Period[] = [
        {
          startDate: new Date(2024, 0, 1),   // Jan 1, 2024
          endDate: new Date(2024, 1, 8),     // Feb 8, 2024 (38 days)
          value: { type: 'number', value: 365 } // Full year value
        }
      ];
      
      const timeline = new TimelineValueImpl({
        periods,
        granularity: 'jaar'
      });
      
      // Test the timeline evaluator directly
      const timelineEvaluator = new (require('../../src/evaluators/timeline-evaluator').TimelineEvaluator)(evaluator);
      
      // Apply tijdsevenredig to the timeline
      const result = timelineEvaluator.applyTijdsevenredigToTimeline(
        timeline,
        'jaar',
        undefined,
        context
      );
      
      // 38 days out of 366 (2024 is leap year) = 38/366 * 365 ≈ 37.9
      expect(result.type).toBe('timeline');
      expect(result.value.periods[0].value.value).toBeCloseTo(37.9, 0);
    });
  });
  
  describe('Temporal Conditions', () => {
    it('should apply tijdsevenredig with temporal condition (parsing test)', () => {
      const code = `
        Objecttype de Passagier
          de belastingvermindering Numeriek (getal met 2 decimalen) met eenheid € voor elke maand;
          het recht op belastingvermindering kenmerk (bezittelijk);

        Parameter de STANDAARD_BELASTINGVERMINDERING : Numeriek (getal met 2 decimalen) met eenheid € voor elk jaar

        Regel Belastingvermindering
          geldig altijd
          De belastingvermindering van een passagier moet gesteld worden op
          (het tijdsevenredig deel per maand van de STANDAARD_BELASTINGVERMINDERING
           gedurende de tijd dat hij een recht op belastingvermindering heeft).
      `;
      
      const parser = new AntlrParser();
      const parseResult = parser.parse(code);
      
      // The parser returns an array of definitions, extract rules
      const rules = Array.isArray(parseResult) 
        ? parseResult.filter((def: any) => def.type === 'Rule')
        : (parseResult.rules || []);
      
      if (!rules || rules.length === 0) {
        console.error('Parse result:', parseResult);
        throw new Error('Failed to parse code - no rules found');
      }
      const ast = { rules };
      
      // Set up parameter timeline
      const paramPeriods: Period[] = [
        {
          startDate: new Date(2024, 0, 1),
          endDate: new Date(2025, 0, 1),
          value: { type: 'number', value: 120, unit: { name: '€' } }
        }
      ];
      
      const paramTimeline = new TimelineValueImpl({
        periods: paramPeriods,
        granularity: 'jaar'
      });
      
      context.setTimelineParameter('STANDAARD_BELASTINGVERMINDERING', paramTimeline);
      
      // Create passagier with right only for part of the year
      const passagier = {
        type: 'object' as const,
        objectType: 'Passagier',
        objectId: 'p1',
        value: {}
      };
      
      context.createObject('Passagier', 'p1', passagier.value);
      
      // Set right timeline - only has right from Jan to Mar
      const rightPeriods: Period[] = [
        {
          startDate: new Date(2024, 0, 1),  // Jan 1
          endDate: new Date(2024, 3, 1),    // Apr 1
          value: { type: 'boolean', value: true }
        },
        {
          startDate: new Date(2024, 3, 1),  // Apr 1
          endDate: new Date(2025, 0, 1),    // Jan 1, 2025
          value: { type: 'boolean', value: false }
        }
      ];
      
      const rightTimeline = new TimelineValueImpl({
        periods: rightPeriods,
        granularity: 'dag'
      });
      
      context.setTimelineAttribute('Passagier', 'p1', 'recht_op_belastingvermindering', rightTimeline);
      context.current_instance = passagier;
      
      // Execute the rule
      const ruleExecutor = new RuleExecutor();
      const rule = ast.rules[0];
      ruleExecutor.execute(rule, context);
      
      // Check results
      // Should have €10/month for Jan-Mar (120/12 = 10)
      // Should have €0/month for Apr-Dec (no right)
      context.evaluation_date = new Date(2024, 1, 15); // Feb 15, 2024
      const febValue = context.getTimelineAttribute('Passagier', 'p1', 'belastingvermindering');
      expect(febValue?.value).toBeCloseTo(10, 1);
      
      context.evaluation_date = new Date(2024, 5, 15); // June 15, 2024
      const juneValue = context.getTimelineAttribute('Passagier', 'p1', 'belastingvermindering');
      expect(juneValue).toBeNull(); // No value when no right
    });
  });
});