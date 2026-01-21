/**
 * Example 3: Object Types and Rules
 *
 * Demonstrates defining object types (Objecttype) and business rules (Regel).
 * Run with: npx ts-node examples/quickstart/03-objects-and-rules.ts
 */
import { Engine, Context } from '../../src';

const engine = new Engine();

// Define a complete domain model with object type and rules
const regelspraakCode = `
Objecttype de Persoon (bezield)
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek;

Objecttype de Bestelling
    het bedrag Numeriek;
    de korting Numeriek;
    het eindbedrag Numeriek;

Regel Minderjarigheid
geldig altijd
    Een Persoon is minderjarig indien
        zijn leeftijd kleiner is dan 18.

Regel Korting berekening
geldig altijd
    De korting van een Bestelling moet berekend worden als
        zijn bedrag maal 0,1.

Regel Eindbedrag berekening
geldig altijd
    Het eindbedrag van een Bestelling moet berekend worden als
        zijn bedrag min zijn korting.
`;

console.log('=== Parsing Domain Model ===');
const parseResult = engine.parseModel(regelspraakCode);

if (!parseResult.success) {
  console.error('Parse errors:', parseResult.errors);
  process.exit(1);
}

console.log('Parsed successfully!');
console.log('Object types:', parseResult.model.objectTypes?.map((ot: any) => ot.naam).join(', '));
console.log('Rules:', parseResult.model.regels?.map((r: any) => r.naam).join(', '));

// Create context and objects
const context = new Context(parseResult.model);

// Create a person and check if they're a minor
console.log('\n=== Testing Minderjarigheid Rule ===');
context.createObject('Persoon', 'kind-1', {
  leeftijd: { type: 'number', value: 12 }
});

context.createObject('Persoon', 'volw-1', {
  leeftijd: { type: 'number', value: 35 }
});

// Execute all rules
engine.execute(parseResult.model, context);

// Retrieve objects and check kenmerk status
const personen = context.getObjectsByType('Persoon');
const kind = personen.find((p: any) => p.objectId === 'kind-1');
const volwassene = personen.find((p: any) => p.objectId === 'volw-1');

console.log('Kind (12 jaar) is minderjarig:', kind?.value?.minderjarig ?? 'not set');
console.log('Volwassene (35 jaar) is minderjarig:', volwassene?.value?.minderjarig ?? 'not set');

// Create an order and calculate discount
console.log('\n=== Testing Bestelling Rules ===');
context.createObject('Bestelling', 'order-1', {
  bedrag: { type: 'number', value: 250 }
});

// Re-execute to process the order
engine.execute(parseResult.model, context);

const bestellingen = context.getObjectsByType('Bestelling');
const bestelling = bestellingen.find((b: any) => b.objectId === 'order-1');

console.log('Bedrag:', bestelling?.value?.bedrag?.value);
console.log('Korting (10%):', bestelling?.value?.korting?.value);
console.log('Eindbedrag:', bestelling?.value?.eindbedrag?.value);
