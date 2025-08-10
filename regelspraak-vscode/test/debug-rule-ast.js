#!/usr/bin/env node

const { AntlrParser } = require('@regelspraak/parser');

const code = `Parameter salaris: Bedrag;
Parameter bonus: Bedrag;
Regel BerekenTotaal
  geldig altijd
    Het totaal wordt salaris plus bonus;`;

console.log('Parsing code:\n', code, '\n');

try {
  const parser = new AntlrParser();
  const result = parser.parseWithLocations(code);
  
  console.log('Parse result keys:', Object.keys(result));
  
  if (result.model && result.model.rules) {
    console.log('\nRules found:', result.model.rules.length);
    
    const rule = result.model.rules[0];
    console.log('\nFirst rule structure:');
    console.log('- name:', rule.name);
    console.log('- type:', rule.type);
    console.log('- version:', JSON.stringify(rule.version, null, 2));
    console.log('- condition:', rule.condition);
    console.log('- result type:', rule.result?.type);
    
    if (rule.result) {
      console.log('\nResult structure:');
      console.log(JSON.stringify(rule.result, null, 2));
    }
  } else {
    console.log('No rules found in model');
    console.log('Model structure:', JSON.stringify(result.model, null, 2));
  }
} catch (e) {
  console.error('Parse error:', e.message);
}