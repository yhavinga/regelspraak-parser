/**
 * Example 4: Relationships (Feittype)
 *
 * Demonstrates how to define and use relationships between objects.
 * Run with: npx ts-node examples/quickstart/04-relationships.ts
 */
import { Engine, Context, ObjectTypeDefinition, FeitType } from '../../src';

const engine = new Engine();

// Define object types and a relationship (Feittype)
// Note: Feittype names must be single words, role types must not include articles
const regelspraakCode = `
Objecttype Afdeling
  de naam Tekst;
  het budget Numeriek;

Objecttype Medewerker (bezield)
  de naam Tekst;
  het salaris Numeriek;

Feittype werkrelatie
  de medewerker	Medewerker
  de afdeling	Afdeling
Een medewerker werkt bij een afdeling
`;

console.log('=== Parsing Model with Relationships ===');
const parseResult = engine.parseModel(regelspraakCode);

if (!parseResult.success) {
  console.error('Parse errors:', parseResult.errors);
  process.exit(1);
}

console.log('Object types:', parseResult.model.objectTypes?.map((ot: ObjectTypeDefinition) => ot.name).join(', '));
console.log('Feit types:', parseResult.model.feitTypes?.map((ft: FeitType) => ft.naam).join(', '));

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
const engineering = afdelingen.find((a) => (a as any).objectId === 'eng-1');
const sales = afdelingen.find((a) => (a as any).objectId === 'sales-1');
const alice = medewerkers.find((m) => (m as any).objectId === 'emp-1');
const bob = medewerkers.find((m) => (m as any).objectId === 'emp-2');
const charlie = medewerkers.find((m) => (m as any).objectId === 'emp-3');

// Create relationships using the feittype name
console.log('\n=== Creating Relationships ===');
if (alice && engineering) context.addRelationship('werkrelatie', alice, engineering);
if (bob && engineering) context.addRelationship('werkrelatie', bob, engineering);
if (charlie && sales) context.addRelationship('werkrelatie', charlie, sales);

console.log('Alice and Bob work in Engineering');
console.log('Charlie works in Sales');

// Query relationships
console.log('\n=== Querying Relationships ===');
if (engineering) {
  const engEmployees = context.getRelatedObjects(engineering, 'werkrelatie', false);
  console.log(`Engineering has ${engEmployees.length} employees`);
}

if (sales) {
  const salesEmployees = context.getRelatedObjects(sales, 'werkrelatie', false);
  console.log(`Sales has ${salesEmployees.length} employees`);
}

console.log('\nNote: Relationship queries return employees linked via the feittype.');
console.log('For aggregation rules like "som van salaris van alle medewerkers",');
console.log('see the full test suite for working examples.');
