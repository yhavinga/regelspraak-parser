#!/usr/bin/env node
// Build script to create a browser-compatible bundle of the parser

const { build } = require('esbuild');
const path = require('path');

async function buildBrowserBundle() {
  try {
    // First create a main entry point that exports everything we need
    const fs = require('fs');
    const engineEntryContent = `
// Re-export everything needed for browser execution
export { Engine } from './engine/engine';
export { Context } from './runtime/context';
export { ExpressionEvaluator } from './evaluators/expression-evaluator';
export { RuleExecutor } from './executors/rule-executor';
export { UnitRegistry } from './units/unit-registry';
export * from './interfaces';
`;
    
    fs.writeFileSync('src/browser-engine.ts', engineEntryContent);
    
    // Bundle parser, analyzer, and engine for real execution
    await build({
      entryPoints: {
        'parser': 'src/parsers/antlr-parser.ts',
        'analyzer': 'src/semantic-analyzer.ts',
        'engine': 'src/browser-engine.ts'  // Use our new entry point
      },
      bundle: true,
      format: 'esm',
      platform: 'browser',
      outdir: 'dist/browser',
      external: [], // Bundle everything including antlr4
      sourcemap: true,
      minify: false,
      target: 'es2020',
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      loader: {
        '.ts': 'ts'
      },
      logLevel: 'info'
    });
    
    // Clean up temporary file
    fs.unlinkSync('src/browser-engine.ts');
    console.log('Browser bundles created successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildBrowserBundle();