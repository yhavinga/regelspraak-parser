/**
 * Example 2: Decision Tables (Beslistabel)
 *
 * Demonstrates how to define and execute decision tables.
 * Run with: npx ts-node examples/quickstart/02-decision-table.ts
 */
import { Engine, Context } from '../../src';

const engine = new Engine();

// Define a simple decision table for travel time pricing
const decisionTable = `
Beslistabel Reisduur tarief
geldig altijd
|   | het tarief moet gesteld worden op | indien de reisduur groter is dan |
|---|-----------------------------------|----------------------------------|
| 1 | 10                                | 30                               |
| 2 | 20                                | 60                               |
| 3 | 30                                | 90                               |
`;

console.log('=== Decision Table: Travel Time Pricing ===');
console.log('Rules:');
console.log('  - reisduur > 90 → tarief = 30');
console.log('  - reisduur > 60 → tarief = 20');
console.log('  - reisduur > 30 → tarief = 10');
console.log('  - otherwise → no match');

// Test with different travel times
const testCases = [25, 45, 75, 120];

for (const reisduur of testCases) {
  const context = new Context();
  context.setVariable('reisduur', { type: 'number', value: reisduur });

  const result = engine.run(decisionTable, context);
  console.log(`\nreisduur = ${reisduur}:`);
  if (result.success) {
    console.log(`  tarief = ${result.value?.value ?? 'geen match'}`);
  } else {
    console.log(`  Error: ${result.error?.message}`);
  }
}

// More complex decision table with multiple conditions
const complexTable = `
Beslistabel Korting bepaling
geldig altijd
|   | de korting moet gesteld worden op | indien de leeftijd kleiner is dan | indien het lidmaatschap gelijk is aan |
|---|-----------------------------------|-----------------------------------|---------------------------------------|
| 1 | 50%                               | 12                                | 'goud'                                |
| 2 | 30%                               | 18                                | 'goud'                                |
| 3 | 20%                               | 65                                | 'zilver'                              |
| 4 | 10%                               | 100                               | 'brons'                               |
`;

console.log('\n\n=== Complex Decision Table: Discount Rules ===');
console.log('Multiple conditions: age AND membership level');

const discountTests = [
  { leeftijd: 10, lidmaatschap: 'goud' },
  { leeftijd: 16, lidmaatschap: 'goud' },
  { leeftijd: 40, lidmaatschap: 'zilver' },
  { leeftijd: 70, lidmaatschap: 'brons' },
];

for (const test of discountTests) {
  const context = new Context();
  context.setVariable('leeftijd', { type: 'number', value: test.leeftijd });
  context.setVariable('lidmaatschap', { type: 'string', value: test.lidmaatschap });

  const result = engine.run(complexTable, context);
  console.log(`\nleeftijd=${test.leeftijd}, lidmaatschap='${test.lidmaatschap}':`);
  if (result.success && result.value) {
    console.log(`  korting = ${result.value.value}%`);
  } else {
    console.log(`  geen korting van toepassing`);
  }
}
