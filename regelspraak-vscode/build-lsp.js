#!/usr/bin/env node
// Build script to create a bundled LSP server with the parser included

const { build } = require('esbuild');
const path = require('path');

async function buildLSPBundle() {
  try {
    // Bundle the LSP server with all dependencies
    await build({
      entryPoints: ['server.ts'],
      bundle: true,
      format: 'cjs',  // CommonJS for Node.js
      platform: 'node',
      outfile: 'dist/server.js',
      external: ['vscode-languageserver', 'vscode-languageserver-textdocument', 'antlr4'],  // Keep LSP libs and antlr4 external
      sourcemap: true,
      minify: false,
      target: 'node16',
      loader: {
        '.ts': 'ts'
      },
      alias: {
        // Map to the TypeScript source files directly - esbuild will compile them
        '@regelspraak/parser/parser': path.resolve(__dirname, '../typescript/src/parsers/antlr-parser.ts'),
        '@regelspraak/parser/analyzer': path.resolve(__dirname, '../typescript/src/semantic-analyzer.ts'),
      },
      // No banner needed - antlr4 will handle its own import_meta
      logLevel: 'info'
    });
    
    console.log('LSP server bundle created successfully at dist/server.js');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildLSPBundle();