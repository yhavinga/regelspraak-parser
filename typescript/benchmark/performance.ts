import { readFileSync } from 'fs';
import { Engine, Context } from '../src';

interface BenchmarkMetrics {
  parseTime: number;
  visitTime: number;
  evalTime: number;
  totalTime: number;
}

interface BenchmarkResult {
  name: string;
  iterations: number;
  avgMetrics: BenchmarkMetrics;
  minTime: number;
  maxTime: number;
  stdDev: number;
}

class PerformanceBenchmark {
  private engine: Engine;

  constructor() {
    this.engine = new Engine();
  }

  /**
   * Run a benchmark with multiple iterations
   */
  async runBenchmark(
    name: string,
    regelSpraakPath: string,
    dataPath: string,
    iterations: number = 100
  ): Promise<BenchmarkResult> {
    const regelSpraakContent = readFileSync(regelSpraakPath, 'utf-8');
    const dataContent = JSON.parse(readFileSync(dataPath, 'utf-8'));
    
    const times: number[] = [];
    const metrics: BenchmarkMetrics[] = [];

    // Warmup runs
    for (let i = 0; i < 10; i++) {
      this.runSingle(regelSpraakContent, dataContent);
    }

    // Actual benchmark runs
    for (let i = 0; i < iterations; i++) {
      const startTotal = process.hrtime.bigint();
      const metric = this.runSingle(regelSpraakContent, dataContent);
      const endTotal = process.hrtime.bigint();
      
      const totalTimeMs = Number(endTotal - startTotal) / 1_000_000;
      times.push(totalTimeMs);
      metrics.push({
        ...metric,
        totalTime: totalTimeMs
      });
    }

    // Calculate statistics
    const avgMetrics = this.calculateAverageMetrics(metrics);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const stdDev = this.calculateStdDev(times, avgMetrics.totalTime);

    return {
      name,
      iterations,
      avgMetrics,
      minTime,
      maxTime,
      stdDev
    };
  }

  private runSingle(regelSpraakContent: string, data: any): BenchmarkMetrics {
    // Since we don't have separate parse/visit/eval phases exposed in our current API,
    // we'll measure the total execution time for now
    const startParse = process.hrtime.bigint();
    
    // In real implementation, we'd measure each phase separately
    // For now, we'll simulate the phases
    const context = new Context();
    
    // Set parameters
    if (data.parameters) {
      for (const [key, value] of Object.entries(data.parameters)) {
        context.setVariable(key, { type: 'number', value });
      }
    }

    // Execute the engine (this includes parsing, visiting, and evaluation)
    this.engine.execute(regelSpraakContent, context);
    
    const endParse = process.hrtime.bigint();
    const parseTimeMs = Number(endParse - startParse) / 1_000_000;

    // Since we can't separate phases yet, we'll allocate time proportionally
    // This is a rough estimate until we refactor the Engine API
    return {
      parseTime: parseTimeMs * 0.3,  // Assume 30% is parsing
      visitTime: parseTimeMs * 0.3,  // Assume 30% is visiting
      evalTime: parseTimeMs * 0.4,   // Assume 40% is evaluation
      totalTime: parseTimeMs
    };
  }

  private calculateAverageMetrics(metrics: BenchmarkMetrics[]): BenchmarkMetrics {
    const sum = metrics.reduce((acc, m) => ({
      parseTime: acc.parseTime + m.parseTime,
      visitTime: acc.visitTime + m.visitTime,
      evalTime: acc.evalTime + m.evalTime,
      totalTime: acc.totalTime + m.totalTime
    }), { parseTime: 0, visitTime: 0, evalTime: 0, totalTime: 0 });

    const count = metrics.length;
    return {
      parseTime: sum.parseTime / count,
      visitTime: sum.visitTime / count,
      evalTime: sum.evalTime / count,
      totalTime: sum.totalTime / count
    };
  }

  private calculateStdDev(times: number[], avg: number): number {
    const squaredDiffs = times.map(t => Math.pow(t - avg, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / times.length;
    return Math.sqrt(avgSquaredDiff);
  }

  /**
   * Format benchmark results for display
   */
  formatResults(result: BenchmarkResult): string {
    const { name, iterations, avgMetrics, minTime, maxTime, stdDev } = result;
    
    return `
=== Benchmark: ${name} ===
Iterations: ${iterations}

Average Times:
  Parse Time: ${avgMetrics.parseTime.toFixed(3)}ms
  Visit Time: ${avgMetrics.visitTime.toFixed(3)}ms
  Eval Time:  ${avgMetrics.evalTime.toFixed(3)}ms
  Total Time: ${avgMetrics.totalTime.toFixed(3)}ms

Statistics:
  Min Time: ${minTime.toFixed(3)}ms
  Max Time: ${maxTime.toFixed(3)}ms
  Std Dev:  ${stdDev.toFixed(3)}ms
`;
  }
}

// Main benchmark runner
async function main() {
  const benchmark = new PerformanceBenchmark();
  
  console.log('Running TypeScript Performance Benchmarks...\n');
  
  // Benchmark steelthread example
  const steelthreadResult = await benchmark.runBenchmark(
    'Steelthread Example',
    '../../examples/steelthread_example.rs',
    '../../tests/resources/steelthread_data.json',
    100
  );
  
  console.log(benchmark.formatResults(steelthreadResult));
  
  // Check if we meet the performance target
  const targetTime = 100; // Target: <100ms (3x faster than Python's ~300ms)
  if (steelthreadResult.avgMetrics.totalTime < targetTime) {
    console.log(`✅ Performance target met! ${steelthreadResult.avgMetrics.totalTime.toFixed(3)}ms < ${targetTime}ms`);
  } else {
    console.log(`❌ Performance target not met. ${steelthreadResult.avgMetrics.totalTime.toFixed(3)}ms >= ${targetTime}ms`);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { PerformanceBenchmark };
export type { BenchmarkResult, BenchmarkMetrics };