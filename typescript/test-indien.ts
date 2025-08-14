import { AntlrParser } from './src/parsers/antlr-parser';

const testSimpleIndien = `
Parameter de volwassenleeftijd: Numeriek (geheel getal) met eenheid jr;

Objecttype de Natuurlijk persoon
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Regel Minderjarigheid
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.
`;

const testCompoundIndien = `
Parameter de minimum leeftijd: Numeriek (geheel getal) met eenheid jr;

Objecttype de Natuurlijk persoon
    is geschikt kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Regel GeschiktheidsTest
    geldig altijd
        Een Natuurlijk persoon is geschikt
        indien hij aan alle volgende voorwaarden voldoet:
            • zijn leeftijd is groter of gelijk aan de minimum leeftijd.
`;

const parser = new AntlrParser();

console.log('Testing simple indien condition...');
try {
  const result1 = parser.parse(testSimpleIndien);
  console.log('✓ Simple indien parsing successful');
  
  // Parser returns an array of items, not a result object with rules property
  const items = result1 as any[];
  const rule = items.find((item: any) => item.type === 'Rule');
  
  if (rule?.condition) {
    console.log('✓ Condition found in rule');
    console.log('  Condition type:', rule.condition.expression.type);
  } else {
    console.log('✗ No condition found in rule');
  }
} catch (e: any) {
  console.log('✗ Simple indien parsing failed:', e.message);
}

console.log('\nTesting compound indien condition...');
try {
  const result2 = parser.parse(testCompoundIndien);
  console.log('✓ Compound indien parsing successful');
  
  // Check if the rule has a compound condition
  const items = result2 as any[];
  const rule = items.find((item: any) => item.type === 'Rule');
  
  if (rule?.condition) {
    console.log('✓ Compound condition found in rule');
    console.log('  Condition type:', rule.condition.expression.type);
    if (rule.condition.expression.type === 'SamengesteldeVoorwaarde') {
      console.log('  Quantifier:', rule.condition.expression.kwantificatie.type);
      console.log('  Number of conditions:', rule.condition.expression.voorwaarden.length);
    }
  } else {
    console.log('✗ No condition found in rule');
  }
} catch (e: any) {
  console.log('✗ Compound indien parsing failed:', e.message);
  if (e.message.includes('not yet supported')) {
    console.log('  (This is expected - compound conditions are not yet implemented)');
  } else {
    // Show detailed error info for debugging
    console.log('Visitor error:', e);
    console.log('Stack:', e.stack);
  }
}