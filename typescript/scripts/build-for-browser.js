#!/usr/bin/env node
// Build script to create a browser-compatible bundle of the parser

const { build } = require('esbuild');
const path = require('path');

async function buildBrowserBundle() {
  try {
    // First, just bundle the parser and semantic analyzer
    await build({
      entryPoints: {
        'parser': 'src/parsers/antlr-parser.ts',
        'analyzer': 'src/semantic-analyzer.ts'
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
    console.log('Browser bundles created successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildBrowserBundle();