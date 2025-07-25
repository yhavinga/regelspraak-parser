#!/usr/bin/env node

import { PerformanceBenchmark } from './performance';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const benchmark = new PerformanceBenchmark();
  
  console.log('Running TypeScript Performance Benchmarks...\n');
  
  // First, let's try with a simple expression that we know works
  const simpleExamplePath = path.join(__dirname, 'simple-example.rs');
  const simpleDataPath = path.join(__dirname, 'simple-data.json');
  
  // Create a simple example that TypeScript can handle
  fs.writeFileSync(simpleExamplePath, '42 + 58');
  fs.writeFileSync(simpleDataPath, '{}');
  
  const simpleResult = await benchmark.runBenchmark(
    'Simple Expression (42 + 58)',
    simpleExamplePath,
    simpleDataPath,
    100
  );
  
  console.log(benchmark.formatResults(simpleResult));
  
  // Try a rule example
  const ruleExamplePath = path.join(__dirname, 'rule-example.rs');
  const ruleDataPath = path.join(__dirname, 'rule-data.json');
  
  fs.writeFileSync(ruleExamplePath, 'Regel test regel alleen x + 10');
  fs.writeFileSync(ruleDataPath, JSON.stringify({ x: 5 }));
  
  const ruleResult = await benchmark.runBenchmark(
    'Simple Rule',
    ruleExamplePath,
    ruleDataPath,
    100
  );
  
  console.log(benchmark.formatResults(ruleResult));
  
  // Load Python baseline for comparison
  const pythonBaselinePath = path.join(__dirname, '../../../benchmark/python_baseline.json');
  if (fs.existsSync(pythonBaselinePath)) {
    const pythonBaseline = JSON.parse(fs.readFileSync(pythonBaselinePath, 'utf-8'));
    
    console.log('\n=== Performance Comparison ===');
    console.log(`Python avg time: ${pythonBaseline.avg_total_time.toFixed(3)}ms`);
    console.log(`TypeScript avg time (simple): ${simpleResult.avgMetrics.totalTime.toFixed(3)}ms`);
    console.log(`TypeScript avg time (rule): ${ruleResult.avgMetrics.totalTime.toFixed(3)}ms`);
    
    const speedupSimple = pythonBaseline.avg_total_time / simpleResult.avgMetrics.totalTime;
    const speedupRule = pythonBaseline.avg_total_time / ruleResult.avgMetrics.totalTime;
    
    console.log(`\nSpeedup (simple): ${speedupSimple.toFixed(2)}x`);
    console.log(`Speedup (rule): ${speedupRule.toFixed(2)}x`);
    
    // Check if we meet the 3x target
    const targetSpeedup = 3.0;
    if (speedupSimple >= targetSpeedup) {
      console.log(`✅ Simple expression meets ${targetSpeedup}x speedup target!`);
    } else {
      console.log(`❌ Simple expression does not meet ${targetSpeedup}x speedup target`);
    }
    
    if (speedupRule >= targetSpeedup) {
      console.log(`✅ Rule execution meets ${targetSpeedup}x speedup target!`);
    } else {
      console.log(`❌ Rule execution does not meet ${targetSpeedup}x speedup target`);
    }
  }
  
  // Save TypeScript results
  const results = {
    simple: simpleResult,
    rule: ruleResult,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'typescript_results.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log('\nResults saved to benchmark/typescript_results.json');
  
  // Cleanup temporary files
  fs.unlinkSync(simpleExamplePath);
  fs.unlinkSync(simpleDataPath);
  fs.unlinkSync(ruleExamplePath);
  fs.unlinkSync(ruleDataPath);
}

main().catch(console.error);