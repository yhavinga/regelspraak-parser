#!/usr/bin/env python3
"""
Python performance benchmark for RegelSpraak parser
"""
import time
import json
import statistics
from pathlib import Path
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.regelspraak.parsing import parse_text
from src.regelspraak.engine import Evaluator
from src.regelspraak.runtime import RuntimeContext

class PythonBenchmark:
    def __init__(self):
        pass
    
    def run_benchmark(self, name, regelspraak_path, data_path, iterations=100):
        """Run benchmark with multiple iterations"""
        
        # Read files
        with open(regelspraak_path, 'r', encoding='utf-8') as f:
            regelspraak_content = f.read()
        
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        times = []
        parse_times = []
        build_times = []
        exec_times = []
        
        # Warmup runs
        for _ in range(10):
            self._run_single(regelspraak_content, data)
        
        # Actual benchmark runs
        for i in range(iterations):
            start_total = time.perf_counter()
            
            # Parse phase (includes building AST)
            start_parse = time.perf_counter()
            model = parse_text(regelspraak_content)
            end_parse = time.perf_counter()
            parse_time = (end_parse - start_parse) * 1000  # Convert to ms
            
            # Build phase is included in parse_text for Python implementation
            build_time = 0
            
            # Create runtime context
            context = RuntimeContext(model)
            
            # Load data into context
            context.load_from_dict(data)
            
            # Execute phase
            start_exec = time.perf_counter()
            evaluator = Evaluator(context)
            evaluator.execute_model(model)
            end_exec = time.perf_counter()
            exec_time = (end_exec - start_exec) * 1000
            
            end_total = time.perf_counter()
            total_time = (end_total - start_total) * 1000
            
            times.append(total_time)
            parse_times.append(parse_time)
            build_times.append(build_time)
            exec_times.append(exec_time)
        
        # Calculate statistics
        return {
            'name': name,
            'iterations': iterations,
            'avg_parse_time': statistics.mean(parse_times),
            'avg_build_time': statistics.mean(build_times),
            'avg_exec_time': statistics.mean(exec_times),
            'avg_total_time': statistics.mean(times),
            'min_time': min(times),
            'max_time': max(times),
            'std_dev': statistics.stdev(times) if len(times) > 1 else 0
        }
    
    def _run_single(self, regelspraak_content, data):
        """Single run for warmup"""
        model = parse_text(regelspraak_content)
        context = RuntimeContext(model)
        context.load_from_dict(data)
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
    
    def format_results(self, result):
        """Format benchmark results for display"""
        return f"""
=== Benchmark: {result['name']} ===
Iterations: {result['iterations']}

Average Times:
  Parse Time: {result['avg_parse_time']:.3f}ms
  Build Time: {result['avg_build_time']:.3f}ms (visitor)
  Exec Time:  {result['avg_exec_time']:.3f}ms
  Total Time: {result['avg_total_time']:.3f}ms

Statistics:
  Min Time: {result['min_time']:.3f}ms
  Max Time: {result['max_time']:.3f}ms
  Std Dev:  {result['std_dev']:.3f}ms
"""

def main():
    benchmark = PythonBenchmark()
    
    print("Running Python Performance Benchmarks...\n")
    
    # Get paths relative to script location
    script_dir = Path(__file__).parent.parent
    
    # Benchmark steelthread example
    steelthread_result = benchmark.run_benchmark(
        'Steelthread Example',
        script_dir / 'examples' / 'steelthread_example.rs',
        script_dir / 'tests' / 'resources' / 'steelthread_data.json',
        100
    )
    
    print(benchmark.format_results(steelthread_result))
    
    # Save results for comparison
    with open(script_dir / 'benchmark' / 'python_baseline.json', 'w') as f:
        json.dump(steelthread_result, f, indent=2)
    
    print(f"\nBaseline saved to benchmark/python_baseline.json")

if __name__ == '__main__':
    main()