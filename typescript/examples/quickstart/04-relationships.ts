/**
 * Example 4: Relationships (Feittype)
 *
 * Demonstrates how to define and use relationships between objects.
 * Run with: npx ts-node examples/quickstart/04-relationships.ts
 */
import { Engine, Context } from '../../src';

const engine = new Engine();

// Define object types and a relationship (Feittype)
const regelspraakCode = `
Objecttype de Afdeling
  de naam : Tekst
  het budget : Numeriek
  het totaal salaris : Numeriek

Objecttype de Medewerker
  de naam : Tekst
  het salaris : Numeriek

Feittype werkt bij
  rol medewerker : Medewerker
  rol afdeling : Afdeling

Regel Totaal salaris berekening
geldig altijd
  Het totaal salaris van een Afdeling is gelijk aan
    de som van het salaris van alle medewerkers die werken bij de Afdeling.
`;

console.log('=== Parsing Model with Relationships ===');
const parseResult = engine.parseModel(regelspraakCode);

if (!parseResult.success) {
  console.error('Parse errors:', parseResult.errors);
  process.exit(1);
}

console.log('Object types:', parseResult.model.objectTypes?.map((ot: any) => ot.naam).join(', '));
console.log('Feit types:', parseResult.model.feitTypes?.map((ft: any) => ft.naam).join(', '));

// Create context and objects
const context = new Context(parseResult.model);

// Create departments
console.log('\n=== Creating Objects ===');
context.createObject('Afdeling', 'eng-1', {
  naam: { type: 'string', value: 'Engineering' },
  budget: { type: 'number', value: 500000 }
});

context.createObject('Afdeling', 'sales-1', {
  naam: { type: 'string', value: 'Sales' },
  budget: { type: 'number', value: 300000 }
});

// Create employees
context.createObject('Medewerker', 'emp-1', {
  naam: { type: 'string', value: 'Alice' },
  salaris: { type: 'number', value: 75000 }
});

context.createObject('Medewerker', 'emp-2', {
  naam: { type: 'string', value: 'Bob' },
  salaris: { type: 'number', value: 65000 }
});

context.createObject('Medewerker', 'emp-3', {
  naam: { type: 'string', value: 'Charlie' },
  salaris: { type: 'number', value: 80000 }
});

// Retrieve created objects
const afdelingen = context.getObjectsByType('Afdeling');
const medewerkers = context.getObjectsByType('Medewerker');
const engineering = afdelingen.find((a: any) => a.objectId === 'eng-1');
const sales = afdelingen.find((a: any) => a.objectId === 'sales-1');
const alice = medewerkers.find((m: any) => m.objectId === 'emp-1');
const bob = medewerkers.find((m: any) => m.objectId === 'emp-2');
const charlie = medewerkers.find((m: any) => m.objectId === 'emp-3');

// Create relationships
console.log('\n=== Creating Relationships ===');
if (alice && engineering) context.addRelationship('werkt bij', alice, engineering, 'medewerker');
if (bob && engineering) context.addRelationship('werkt bij', bob, engineering, 'medewerker');
if (charlie && sales) context.addRelationship('werkt bij', charlie, sales, 'medewerker');

console.log('Alice and Bob work in Engineering');
console.log('Charlie works in Sales');

// Query relationships
console.log('\n=== Querying Relationships ===');
if (engineering) {
  const engEmployees = context.getRelatedObjects(engineering, 'werkt bij', true);
  console.log(`Engineering has ${engEmployees.length} employees`);
}

if (sales) {
  const salesEmployees = context.getRelatedObjects(sales, 'werkt bij', true);
  console.log(`Sales has ${salesEmployees.length} employees`);
}

// Execute rules to calculate totals
console.log('\n=== Executing Rules ===');
engine.execute(parseResult.model, context);

console.log('Engineering totaal salaris:', engineering?.value?.['totaal salaris']?.value ?? 'not calculated');
console.log('Sales totaal salaris:', sales?.value?.['totaal salaris']?.value ?? 'not calculated');
