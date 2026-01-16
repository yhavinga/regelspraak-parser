#!/usr/bin/env npx ts-node
/**
 * TOKA Example Runner - Execute TOKA case study scenarios in TypeScript.
 * 
 * This mirrors the Python runner in examples/toka/run_toka.py
 * 
 * Usage:
 *   npx ts-node examples/toka/run_toka.ts simple
 *   npx ts-node examples/toka/run_toka.ts multiple_passengers
 */

import * as fs from 'fs';
import * as path from 'path';
import { Engine } from '../../src/engine/engine';
import { Context } from '../../src/runtime/context';
import { Value } from '../../src/interfaces';

// Unit aliases mapping (scenario JSON → model definitions)
const UNIT_ALIASES: Record<string, string> = {
    'min': 'minuut',
    'jr': 'jaar',
    's': 'seconde',
    'u': 'uur',
    'km': 'kilometer',
};

interface ScenarioData {
    name: string;
    description: string;
    rekendatum?: string;
    parameters: Record<string, any>;
    objects: {
        passengers?: any[];
        flights?: any[];
    };
    relationships?: Array<{
        type: string;
        flight_id: string;
        passenger_id: string;
    }>;
    expected?: Record<string, Record<string, any>>;
}

/**
 * TOKA Runner class - orchestrates scenario execution
 */
export class TOKARunner {
    private tokaDir: string;
    private engine: Engine;
    private context: Context | null = null;
    private model: any = null;
    private verbose: boolean;

    constructor(verbose: boolean = false) {
        // Find the TOKA directory relative to this file
        this.tokaDir = path.resolve(__dirname, '../../../examples/toka');
        this.engine = new Engine();
        this.verbose = verbose;
    }

    /**
     * Load and combine TOKA RegelSpraak files
     */
    loadRules(): string {
        const gegevensPath = path.join(this.tokaDir, 'gegevens.rs');
        const regelsPath = path.join(this.tokaDir, 'regels.rs');

        const gegevens = fs.readFileSync(gegevensPath, 'utf-8');
        const regels = fs.readFileSync(regelsPath, 'utf-8');

        return `${gegevens}\n\n${regels}`;
    }

    /**
     * Load test scenario from JSON file
     */
    loadScenario(scenarioName: string): ScenarioData {
        const scenarioPath = path.join(this.tokaDir, 'scenarios', `${scenarioName}.json`);
        if (!fs.existsSync(scenarioPath)) {
            throw new Error(`Scenario not found: ${scenarioPath}`);
        }

        const content = fs.readFileSync(scenarioPath, 'utf-8');
        return JSON.parse(content);
    }

    /**
     * Normalize a unit name using aliases
     */
    private normalizeUnit(unit: string): string {
        return UNIT_ALIASES[unit] || unit;
    }

    /**
     * Parse a scenario value into a proper Value object
     */
    private parseScenarioValue(data: any, datatype?: string): Value {
        if (typeof data === 'object' && data !== null && 'value' in data) {
            // { value: 18, unit: 'jr' } format
            return {
                type: 'number',
                value: data.value,
                unit: data.unit ? { name: this.normalizeUnit(data.unit) } : undefined
            };
        }

        if (datatype?.includes('Datum') && typeof data === 'string') {
            // Parse ISO date string to Date object
            return { type: 'date', value: new Date(data) };
        }

        if (typeof data === 'number') {
            return { type: 'number', value: data };
        }

        if (typeof data === 'boolean') {
            return { type: 'boolean', value: data };
        }

        if (typeof data === 'string') {
            return { type: 'string', value: data };
        }

        return { type: 'null', value: null };
    }

    /**
     * Add parameters to the context
     */
    private addParameters(parameters: Record<string, any>): void {
        if (!this.context) return;

        for (const [paramName, paramData] of Object.entries(parameters)) {
            // Find parameter definition to get unit if specified
            const paramDef = this.model.parameters?.find((p: any) => p.name === paramName);
            const value = this.parseScenarioValue(paramData, paramDef?.dataType?.type);

            // Attach unit from parameter definition if not already present in data
            if (paramDef?.unit && !value.unit) {
                value.unit = { name: paramDef.unit };  // Use canonical unit from parameter definition
            }

            this.context.setVariable(paramName, value);
        }

        if (this.verbose) {
            console.log(`✅ Added ${Object.keys(parameters).length} parameters`);
        }
    }

    /**
     * Create object instances
     */
    private createObjects(objects: ScenarioData['objects']): void {
        if (!this.context) return;

        let objectCount = 0;

        // Create passengers
        for (const passengerData of objects.passengers || []) {
            const attributes: Record<string, Value> = {};

            // Parse passenger attributes
            for (const [key, value] of Object.entries(passengerData)) {
                if (key === 'id') continue;

                if (key === 'geboortedatum') {
                    attributes[key] = { type: 'date', value: new Date(value as string) };
                } else if (typeof value === 'number') {
                    attributes[key] = { type: 'number', value };
                } else if (typeof value === 'boolean') {
                    attributes[key] = { type: 'boolean', value };
                } else {
                    attributes[key] = { type: 'string', value: value as string };
                }
            }

            this.context.createObject('Natuurlijk persoon', passengerData.id, attributes);
            objectCount++;
        }

        // Create flights
        for (const flightData of objects.flights || []) {
            const attributes: Record<string, Value> = {};

            for (const [key, value] of Object.entries(flightData)) {
                if (key === 'id') continue;

                if (key === 'vluchtdatum') {
                    attributes[key] = { type: 'date', value: new Date(value as string) };
                } else if (key.includes('datum-tijd') || key.includes('tijdstip')) {
                    attributes[key] = { type: 'date', value: new Date(value as string) };
                } else if (typeof value === 'number') {
                    // Handle units for known attributes
                    if (key === 'afstand tot bestemming') {
                        attributes[key] = { type: 'number', value, unit: { name: 'km' } };
                    } else if (key === 'reisduur per trein' || key === 'verwachte duur') {
                        attributes[key] = { type: 'number', value, unit: { name: 'minuut' } };
                    } else {
                        attributes[key] = { type: 'number', value };
                    }
                } else if (typeof value === 'boolean') {
                    attributes[key] = { type: 'boolean', value };
                } else {
                    attributes[key] = { type: 'string', value: value as string };
                }
            }

            this.context.createObject('Vlucht', flightData.id, attributes);
            objectCount++;
        }

        if (this.verbose) {
            console.log(`✅ Created ${objectCount} objects`);
        }
    }

    /**
     * Create relationships between objects
     */
    private createRelationships(relationships: ScenarioData['relationships']): void {
        if (!this.context || !relationships) return;

        for (const rel of relationships) {
            if (rel.type === 'vlucht van natuurlijke personen') {
                const flight = this.findObjectById('Vlucht', rel.flight_id);
                const passenger = this.findObjectById('Natuurlijk persoon', rel.passenger_id);

                if (flight && passenger) {
                    this.context.addRelationship(
                        'vlucht van natuurlijke personen',
                        flight,
                        passenger,
                        'VAN'
                    );

                    // Derive "is een passagier" kenmerk from FeitType relationship
                    // When a person is in "vlucht van natuurlijke personen" as the passenger role,
                    // they are "een passagier"
                    const passengerData = (passenger as any).value as Record<string, Value>;
                    passengerData['is een passagier'] = { type: 'boolean', value: true };

                    // Also store the flight as "zijn reis" for navigation
                    passengerData['reis'] = flight;
                }
            }
        }

        if (this.verbose) {
            console.log(`✅ Created ${relationships.length} relationships`);
        }
    }

    /**
     * Find an object by its ID
     */
    private findObjectById(type: string, id: string): Value | null {
        if (!this.context) return null;

        const objects = this.context.getObjectsByType(type);
        for (const obj of objects) {
            if ((obj as any).objectId === id) {
                return obj;
            }
        }
        return null;
    }

    /**
     * Execute a TOKA scenario
     */
    async executeScenario(scenarioName: string): Promise<{
        scenario: string;
        status: 'success' | 'failed';
        validation?: { passed: string[]; failed: string[] };
        error?: string;
    }> {
        try {
            // Load and parse rules
            console.log('Loading TOKA rules...');
            const rulesText = this.loadRules();
            const parseResult = this.engine.parseModel(rulesText);

            if (!parseResult.success) {
                throw new Error(`Parse error: ${parseResult.errors?.join(', ')}`);
            }

            this.model = parseResult.model;
            console.log(`✅ Successfully parsed rules`);

            // Load scenario
            console.log(`Loading scenario: ${scenarioName}`);
            const scenario = this.loadScenario(scenarioName);
            console.log(`✅ Loaded scenario: ${scenario.name}`);

            // Create runtime context
            this.context = new Context(this.model);

            // Store source text for DisjunctionExpression workaround
            (this.context as any).sourceText = rulesText;

            // Set rekendatum if provided
            if (scenario.rekendatum) {
                this.context.setEvaluationDate(new Date(scenario.rekendatum));
            } else {
                // Default: middle of summer season
                this.context.setEvaluationDate(new Date('2024-07-15'));
            }

            // Add parameters
            this.addParameters(scenario.parameters);

            // Create objects
            this.createObjects(scenario.objects);

            // Create relationships
            this.createRelationships(scenario.relationships);

            // Execute rules
            console.log('Executing rules...');
            const result = this.engine.execute(this.model, this.context);

            if (!result.success) {
                throw new Error(`Execution error: ${result.error?.message}`);
            }
            console.log('✅ Rule execution completed');

            // Validate results if expected values provided
            let validation: { passed: string[]; failed: string[] } | undefined;
            if (scenario.expected) {
                validation = this.validateResults(scenario.expected);
                this.printValidationResults(validation);
            }

            // Print final state
            this.printFinalState();

            return {
                scenario: scenarioName,
                status: 'success',
                validation
            };

        } catch (error) {
            console.error(`❌ Error: ${error}`);
            return {
                scenario: scenarioName,
                status: 'failed',
                error: (error as Error).message
            };
        }
    }

    /**
     * Validate execution results against expected values
     */
    private validateResults(expected: Record<string, Record<string, any>>): { passed: string[]; failed: string[] } {
        const results = { passed: [] as string[], failed: [] as string[] };

        for (const [objectId, expectedValues] of Object.entries(expected)) {
            const obj = this.findObjectById('Natuurlijk persoon', objectId) ||
                this.findObjectById('Vlucht', objectId);

            if (!obj) {
                results.failed.push(`Object ${objectId} not found`);
                continue;
            }

            for (const [attrName, expectedValue] of Object.entries(expectedValues)) {
                const objData = (obj as any).value || {};
                const actual = objData[attrName];

                if (actual !== undefined) {
                    const actualValue = (actual as Value)?.value ?? actual;
                    if (actualValue === expectedValue) {
                        results.passed.push(`${objectId}.${attrName}`);
                    } else {
                        results.failed.push(
                            `${objectId}.${attrName}: expected ${expectedValue}, got ${actualValue}`
                        );
                    }
                } else {
                    results.failed.push(`${objectId}.${attrName}: attribute not found`);
                }
            }
        }

        return results;
    }

    /**
     * Print validation results
     */
    private printValidationResults(results: { passed: string[]; failed: string[] }): void {
        console.log('\n' + '='.repeat(60));
        console.log('VALIDATION RESULTS');
        console.log('='.repeat(60));

        if (results.passed.length > 0) {
            console.log(`✅ Passed: ${results.passed.length}`);
            if (this.verbose) {
                for (const item of results.passed) {
                    console.log(`   - ${item}`);
                }
            }
        }

        if (results.failed.length > 0) {
            console.log(`❌ Failed: ${results.failed.length}`);
            for (const item of results.failed) {
                console.log(`   - ${item}`);
            }
        }
    }

    /**
     * Print final state of key objects
     */
    private printFinalState(): void {
        console.log('\n' + '='.repeat(60));
        console.log('FINAL STATE');
        console.log('='.repeat(60));

        if (!this.context) return;

        // Print passengers
        const passengers = this.context.getObjectsByType('Natuurlijk persoon');
        if (passengers.length > 0) {
            console.log('\nPassengers:');
            for (const p of passengers) {
                console.log(`  ${(p as any).objectId}:`);
                const attrs = (p as any).value || {};
                for (const [key, val] of Object.entries(attrs)) {
                    const value = (val as Value)?.value ?? val;
                    const unit = (val as Value)?.unit || '';
                    console.log(`    - ${key}: ${value}${unit ? ' ' + unit : ''}`);
                }
            }
        }

        // Print flights
        const flights = this.context.getObjectsByType('Vlucht');
        if (flights.length > 0) {
            console.log('\nFlights:');
            for (const f of flights) {
                console.log(`  ${(f as any).objectId}:`);
                const attrs = (f as any).value || {};
                for (const [key, val] of Object.entries(attrs)) {
                    const value = (val as Value)?.value ?? val;
                    const unit = (val as Value)?.unit || '';
                    console.log(`    - ${key}: ${value}${unit ? ' ' + unit : ''}`);
                }
            }
        }
    }
}

// Main execution
async function main() {
    const args = process.argv.slice(2);
    const scenarioName = args[0] || 'simple';
    const verbose = args.includes('--verbose') || args.includes('-v');

    const runner = new TOKARunner(verbose);
    const result = await runner.executeScenario(scenarioName);

    if (result.status === 'failed') {
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}
