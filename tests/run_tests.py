#!/usr/bin/env python3
"""Test runner for RegelSpraak parser tests."""

import unittest
import sys
import os

# Add the project root directory to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

def run_all_tests():
    """Discovers and runs all tests in the 'tests' directory."""
    print(f"Discovering tests in: {os.path.dirname(__file__)}")
    print(f"Project root added to path: {project_root}")
    print(f"Current sys.path: {sys.path}")
    
    # Discover tests in the current directory ('tests')
    # The pattern 'test_*.py' finds all files starting with 'test_'
    loader = unittest.TestLoader()
    suite = loader.discover(start_dir=os.path.dirname(__file__),
                          pattern='test_*.py') # Ensure this pattern finds all test files
    
    # Check if tests were found
    if suite.countTestCases() == 0:
        print("No tests found. Check the directory and pattern.")
        return

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

if __name__ == '__main__':
    run_all_tests() 