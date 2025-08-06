#!/usr/bin/env node

/**
 * Extract multi-word keywords from RegelSpraakLexer.g4
 * 
 * This is the right way to do it. Don't hardcode what you can extract.
 * The lexer is the source of truth for all keywords.
 */

const fs = require('fs');
const path = require('path');

const lexerPath = path.join(__dirname, '../../grammar/RegelSpraakLexer.g4');
const outputPath = path.join(__dirname, '../src/generated/multiword-keywords.json');

// Read lexer grammar
const lexerContent = fs.readFileSync(lexerPath, 'utf8');

// Extract all token definitions with multi-word literals
// Pattern: TOKEN_NAME : 'literal with spaces' ;
const tokenPattern = /^([A-Z_]+)\s*:\s*'([^']+)'\s*;/gm;
const multiWordKeywords = [];

let match;
while ((match = tokenPattern.exec(lexerContent)) !== null) {
  const tokenName = match[1];
  const literal = match[2].toLowerCase();
  
  // Only keep multi-word literals (contain spaces)
  if (literal.includes(' ')) {
    multiWordKeywords.push({
      token: tokenName,
      literal: literal
    });
  }
}

console.log(`Found ${multiWordKeywords.length} multi-word keywords`);

// Group by first word for efficient lookup
const byFirstWord = {};
for (const keyword of multiWordKeywords) {
  const firstWord = keyword.literal.split(' ')[0];
  if (!byFirstWord[firstWord]) {
    byFirstWord[firstWord] = [];
  }
  byFirstWord[firstWord].push(keyword.literal);
}

// Sort and deduplicate
for (const firstWord in byFirstWord) {
  byFirstWord[firstWord] = [...new Set(byFirstWord[firstWord])].sort();
}

// Write to JSON file
const output = {
  generated: new Date().toISOString(),
  source: 'grammar/RegelSpraakLexer.g4',
  totalMultiWords: multiWordKeywords.length,
  byFirstWord: byFirstWord,
  allMultiWords: multiWordKeywords.map(k => k.literal).sort()
};

// Ensure directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Generated ${outputPath}`);

// Also generate TypeScript interface
const tsContent = `// Generated from grammar/RegelSpraakLexer.g4
// Do not edit manually - run: node scripts/extract-multiword.js

export interface MultiWordData {
  generated: string;
  source: string;
  totalMultiWords: number;
  byFirstWord: Record<string, string[]>;
  allMultiWords: string[];
}

export const multiWordKeywords: MultiWordData = ${JSON.stringify(output, null, 2)};
`;

const tsPath = path.join(__dirname, '../src/generated/multiword-keywords.ts');
fs.writeFileSync(tsPath, tsContent);
console.log(`Generated ${tsPath}`);