/**
 * Example 5: Units and Dimensions (Eenheidsysteem)
 *
 * Demonstrates unit handling and conversions.
 * Run with: npx ts-node examples/quickstart/05-units.ts
 */
import { Engine, Context } from '../../src';

const engine = new Engine();

// Define a unit system
const regelspraakCode = `
Eenheidsysteem afstand
  meter (m)
  kilometer (km) = 1000 meter
  mijl (mi) = 1609 meter

Eenheidsysteem tijd
  seconde (s)
  minuut (min) = 60 seconden
  uur (u) = 3600 seconden

Objecttype de Reis
  de afstand : Numeriek met eenheid meter
  de duur : Numeriek met eenheid minuut
  de snelheid : Numeriek

Parameter de maximale snelheid : Numeriek = 120

Regel Snelheid berekening
geldig altijd
  De snelheid van een Reis moet berekend worden als
    zijn afstand gedeeld door zijn duur.
`;

console.log('=== Unit Systems ===');
const parseResult = engine.parseModel(regelspraakCode);

if (!parseResult.success) {
  console.error('Parse errors:', parseResult.errors);
  process.exit(1);
}

console.log('Parsed successfully!');

// Test unit arithmetic
console.log('\n=== Unit Arithmetic ===');
const context = new Context(parseResult.model);

// Direct expressions with units
console.log('5 kilometer:', engine.run('5 kilometer', context).value);
console.log('1000 meter:', engine.run('1000 meter', context).value);

// Create a trip and calculate speed
console.log('\n=== Trip Speed Calculation ===');
context.createObject('Reis', 'reis-1', {
  afstand: { type: 'number', value: 150000, unit: { name: 'meter' } },  // 150 km
  duur: { type: 'number', value: 90 }  // 90 minutes
});

engine.execute(parseResult.model, context);

const reizen = context.getObjectsByType('Reis');
const reis = reizen.find((r: any) => r.objectId === 'reis-1');

console.log('Afstand:', reis?.value?.afstand?.value, 'meter (150 km)');
console.log('Duur:', reis?.value?.duur?.value, 'minuten');
console.log('Snelheid:', reis?.value?.snelheid?.value, 'm/min');

// Convert to km/h: 150km / 1.5h = 100 km/h
const speedKmH = (reis?.value?.snelheid?.value ?? 0) * 60 / 1000;
console.log('Snelheid in km/u:', speedKmH.toFixed(1));
