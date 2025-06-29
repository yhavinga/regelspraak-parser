import unittest
import pathlib
import json
from click.testing import CliRunner

# Assuming cli is importable from the root package
from regelspraak.cli import cli 

RESOURCES_DIR = pathlib.Path("tests/resources")
VALID_RS_FILE = RESOURCES_DIR / "steelthread_example.rs"
VALID_DATA_FILE = RESOURCES_DIR / "steelthread_data.json"
NON_EXISTENT_FILE = RESOURCES_DIR / "does_not_exist.rs"

INVALID_RS_CONTENT = "Parameter x : Numeriek met eenheid jr Regel Y dit is syntax error."
INVALID_JSON_CONTENT = '{"parameters": {"age": 18}, "instances": ["not an object"]}'
TEMP_INVALID_RS = RESOURCES_DIR / "temp_invalid_syntax.rs"
TEMP_INVALID_JSON = RESOURCES_DIR / "temp_invalid_data.json"


class CliTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Create temporary invalid files before tests run."""
        RESOURCES_DIR.mkdir(exist_ok=True) # Ensure resources dir exists
        with open(TEMP_INVALID_RS, "w", encoding='utf-8') as f:
            f.write(INVALID_RS_CONTENT)
        with open(TEMP_INVALID_JSON, "w", encoding='utf-8') as f:
            f.write(INVALID_JSON_CONTENT)

    @classmethod
    def tearDownClass(cls):
        """Remove temporary invalid files after tests run."""
        TEMP_INVALID_RS.unlink(missing_ok=True)
        TEMP_INVALID_JSON.unlink(missing_ok=True)

    def setUp(self):
        """Set up the test runner before each test."""
        self.runner = CliRunner()

    # --- Test 'validate' command --- 

    def test_validate_success(self):
        """Test 'validate' with a valid file."""
        result = self.runner.invoke(cli, ['validate', str(VALID_RS_FILE)])
        self.assertEqual(result.exit_code, 0, f"CLI exited with code {result.exit_code}\nOutput:\n{result.output}")
        self.assertIn("Parsing successful.", result.output)
        self.assertIn("validation successful.", result.output)

    def test_validate_non_existent_file(self):
        """Test 'validate' with a non-existent file."""
        result = self.runner.invoke(cli, ['validate', str(NON_EXISTENT_FILE)])
        self.assertNotEqual(result.exit_code, 0) # Should fail
        self.assertIn("Invalid value", result.output) # click's error message
        self.assertIn("does not exist", result.output)

    def test_validate_syntax_error(self):
        """Test 'validate' with a file containing syntax errors."""
        result = self.runner.invoke(cli, ['validate', str(TEMP_INVALID_RS)])
        self.assertNotEqual(result.exit_code, 0, f"CLI should have failed, but exited with 0.\nOutput:\n{result.output}")
        self.assertIn("Parse Error", result.output)
        # Add check for line/column if error reporting includes it consistently
        # self.assertIn("Line 1:", result.output) 

    # --- Test 'run' command --- 

    def test_run_success_with_data(self):
        """Test 'run' with valid rs and data files."""
        result = self.runner.invoke(cli, [
            'run',
            str(VALID_RS_FILE),
            '--data', str(VALID_DATA_FILE)
        ])
        self.assertEqual(result.exit_code, 0, f"CLI exited with code {result.exit_code}\nOutput:\n{result.output}")
        self.assertIn("Parsing successful.", result.output)
        self.assertIn("Loading data", result.output)
        self.assertIn("Loaded 1 parameters", result.output)
        self.assertIn("Loaded 2 instances", result.output)
        self.assertIn("Executing model...", result.output)
        # Check for trace output indicating rule execution
        self.assertIn("RULE_FIRED", result.output)
        self.assertIn("kenmerk:minderjarig", result.output)
        self.assertIn("Execution finished.", result.output)
        # Check final state includes the result
        self.assertIn("'minderjarig': True", result.output)
        self.assertNotIn("'minderjarig': False", result.output)

    def test_run_success_without_data(self):
        """Test 'run' with a valid file but no data."""
        result = self.runner.invoke(cli, ['run', str(VALID_RS_FILE)])
        self.assertEqual(result.exit_code, 0, f"CLI exited with code {result.exit_code}\nOutput:\n{result.output}")
        self.assertIn("Parsing successful.", result.output)
        self.assertNotIn("Loading data", result.output) # Ensure data loading is skipped
        self.assertIn("Executing model...", result.output)
        self.assertIn("Execution finished.", result.output)
        self.assertIn("Parameters: {}", result.output) # Expect empty context
        self.assertIn("Instances: defaultdict(<class 'list'>, {})", result.output)

    def test_run_syntax_error(self):
        """Test 'run' when the .rs file has a syntax error."""
        result = self.runner.invoke(cli, ['run', str(TEMP_INVALID_RS)])
        self.assertNotEqual(result.exit_code, 0) # Should fail during parsing
        # Check for the error printed by the except RegelspraakError block
        self.assertIn("Runtime Error: Failed to parse text:", result.output) 
        self.assertNotIn("Executing model", result.output) # Should not reach execution

    def test_run_data_file_non_existent(self):
        """Test 'run' when the specified data file does not exist."""
        result = self.runner.invoke(cli, [
            'run',
            str(VALID_RS_FILE),
            '--data', str(NON_EXISTENT_FILE) # Use non-existent path
        ])
        self.assertNotEqual(result.exit_code, 0) # click should handle bad path
        self.assertIn("Invalid value", result.output) 
        self.assertIn("does not exist", result.output)

    def test_run_data_file_invalid_json(self):
        """Test 'run' when the data file contains invalid JSON structure.""" # Updated docstring
        result = self.runner.invoke(cli, [
            'run',
            str(VALID_RS_FILE),
            '--data', str(TEMP_INVALID_JSON)
        ])
        self.assertNotEqual(result.exit_code, 0, f"CLI exited with code {result.exit_code}\\nOutput:\\n{result.output}") # Check exit code
        self.assertIn("Runtime Error", result.output) # Check for the generic prefix
        # Check for the more specific error message about invalid format
        self.assertIn("Invalid instance data format", result.output) # <<< THIS IS THE IMPORTANT CHANGE
        # self.assertIn("Error decoding JSON", result.output) # <<< REMOVE OR COMMENT OUT THIS LINE
        self.assertNotIn("Executing model", result.output) # Should not reach execution


if __name__ == '__main__':
    unittest.main() 