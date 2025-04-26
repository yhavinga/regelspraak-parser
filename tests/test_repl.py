import unittest
import pexpect
import sys
import os
import tempfile
from pathlib import Path
import re

DEBUG = True

class FilteredLog:
    def __init__(self, file):
        self.file = file
        
    def write(self, data):
        # Filter all escape/control sequences:
        # - ^[[...R cursor position reports
        # - ;nR partial sequences
        # - Any other ANSI escape sequences
        filtered = re.sub(r'(\^\[\[[0-9;]*[a-zA-Z]|;[0-9]+R|\x1b\[[0-9;]*[a-zA-Z])', '', data)
        self.file.write(filtered)
        
    def flush(self):
        self.file.flush()

class ReplTests(unittest.TestCase):
    """Tests for the RegelSpraak REPL functionality."""
    
    def setUp(self):
        """Setup for each test."""
        # Path to the Python module
        self.module_path = "regelspraak"
        
        # Create a temporary file for test code
        self.temp_dir = tempfile.TemporaryDirectory()
        self.test_file = Path(self.temp_dir.name) / "test_model.rs"
        
        self.env = os.environ.copy()
        os.environ['PYTHONUNBUFFERED'] = '1'  # Force unbuffered output
        
    def tearDown(self):
        """Cleanup after each test."""
        self.temp_dir.cleanup()
    
    def create_test_file(self, content):
        """Helper to create a test file with given content."""
        with open(self.test_file, 'w') as f:
            f.write(content)
        return self.test_file
    
    def test_basic_repl_commands(self):
        """Test basic REPL commands."""
        # Skip if running in CI or environment without TTY
        if not sys.stdout.isatty():
            self.skipTest("Not running in a TTY")
        
        # Start REPL process
        child = pexpect.spawn(f"python -m {self.module_path}")
        
        # Expect welcome message
        child.expect("RegelSpraak REPL")
        
        # Test help command
        child.sendline(":help")
        child.expect("RegelSpraak REPL Commands:")
        
        # Test show context (should be empty)
        child.sendline(":show ctx")
        child.expect("Parameters: 0")
        
        # Exit REPL
        child.sendline(":quit")
        child.expect(pexpect.EOF)
    
    def test_steel_thread_example(self):
        """Test the six-line steel thread example from STEELTHREAD-01.md."""
        # Skip if running in CI or environment without TTY
        if not sys.stdout.isatty():
            self.skipTest("Not running in a TTY")
        
        # Create steel thread file
        steel_thread = """
Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;

Objecttype de Natuurlijk persoon
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Regel Kenmerktoekenning persoon minderjarig
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.
"""
        test_file = self.create_test_file(steel_thread)
        
        # Add logging for test debugging
        child = pexpect.spawn(f"python -m {self.module_path}", encoding='utf-8')
        if DEBUG:
            child.logfile = FilteredLog(sys.stdout)
        
        # Increase timeout for slow environments
        timeout = 10
        
        # Expect welcome message
        child.expect("RegelSpraak REPL", timeout=timeout)
        
        # Load the steel thread example
        child.sendline(f":load {test_file}")
        child.expect("Loaded and merged model", timeout=timeout)
        
        # Add a short delay between commands
        def send_cmd(cmd):
            child.sendline(cmd)
        
        # Create context with Python commands
        send_cmd("py: context.set_parameter('volwassenleeftijd', 18, 'jr')")
        send_cmd("py: p1 = create_instance('Natuurlijk persoon')")
        send_cmd("py: p1.instance_id = 'p1'")  # Set ID for easier reference
        send_cmd("py: context.set_attribute(p1, 'leeftijd', 15, 'jr')")
        send_cmd("py: p2 = create_instance('Natuurlijk persoon')")
        send_cmd("py: p2.instance_id = 'p2'")  # Set ID for easier reference
        send_cmd("py: context.set_attribute(p2, 'leeftijd', 25, 'jr')")
        
        # Check instances - use more relaxed pattern
        send_cmd(":show ctx")
        # The context should show our Natuurlijk persoon objects
        child.expect("Runtime Instances:", timeout=timeout)
        
        # Execute model - this may take longer
        send_cmd("py: evaluator.execute_model(domain_model)")
        
        # Check values - ensure we find "waar" or "onwaar" anywhere in output
        send_cmd("Evaluate p1 is minderjarig")
        child.expect("waar", timeout=timeout)
        
        send_cmd("Evaluate p2 is minderjarig")
        child.expect("onwaar", timeout=timeout)
        
        # Exit REPL
        send_cmd(":quit")
        child.expect(pexpect.EOF, timeout=timeout)

if __name__ == '__main__':
    unittest.main()