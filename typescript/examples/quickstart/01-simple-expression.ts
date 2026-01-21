/**
 * Example 1: Simple Expression Evaluation
 *
 * Demonstrates how to evaluate RegelSpraak expressions directly.
 * Run with: npx ts-node examples/quickstart/01-simple-expression.ts
 */
import { Engine, Context } from '../../src';

const engine = new Engine();

// Basic arithmetic
console.log('=== Basic Arithmetic ===');
console.log('10 plus 5:', engine.run('10 plus 5').value);
console.log('100 min 25:', engine.run('100 min 25').value);
console.log('6 maal 7:', engine.run('6 maal 7').value);
console.log('144 gedeeld door 12:', engine.run('144 gedeeld door 12').value);

// Functions
console.log('\n=== Functions ===');
console.log('de wortel van 16:', engine.run('de wortel van 16').value);
console.log('de absolute waarde van (-42):', engine.run('de absolute waarde van (-42)').value);

// Comparisons (return boolean)
console.log('\n=== Comparisons ===');
console.log('5 groter dan 3:', engine.run('5 groter dan 3').value);
console.log('10 kleiner dan 5:', engine.run('10 kleiner dan 5').value);
console.log('7 gelijk aan 7:', engine.run('7 gelijk aan 7').value);

// With variables
console.log('\n=== With Variables ===');
const context = new Context();
context.setVariable('leeftijd', { type: 'number', value: 25 });
context.setVariable('drempel', { type: 'number', value: 18 });

const result = engine.run('leeftijd groter dan drempel', context);
console.log('leeftijd (25) groter dan drempel (18):', result.value);

// Rounding (requires variable reference)
console.log('\n=== Rounding ===');
const roundContext = new Context();
roundContext.setVariable('waarde', { type: 'number', value: 26.5 });

console.log('waarde = 26,5');
console.log('naar beneden afgerond op 0 decimalen:',
  engine.run('de waarde naar beneden afgerond op 0 decimalen', roundContext).value);
console.log('naar boven afgerond op 0 decimalen:',
  engine.run('de waarde naar boven afgerond op 0 decimalen', roundContext).value);
console.log('rekenkundig afgerond op 0 decimalen:',
  engine.run('de waarde rekenkundig afgerond op 0 decimalen', roundContext).value);
