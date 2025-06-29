import click
import sys
import pathlib
import json
from typing import Optional
from .parsing import parse_text
from .semantics import validate as validate_semantics
from .errors import RegelspraakError, ParseError, RuntimeError # Added RuntimeError
from .runtime import RuntimeContext, Value, RuntimeObject # Added Value, RuntimeObject
from .engine import Evaluator, PrintTraceSink

@click.group(invoke_without_command=True)
@click.pass_context
def cli(ctx):
    """RegelSpraak Parser & Engine CLI."""
    # If no subcommand is given, launch the REPL
    if ctx.invoked_subcommand is None:
        ctx.invoke(repl)

@cli.command()
@click.argument("file", type=click.Path(exists=True, path_type=pathlib.Path))
def validate(file: pathlib.Path):
    """Parse and semantically validate a RegelSpraak file."""
    click.echo(f"Validating {file.name}...")
    try:
        text = file.read_text(encoding='utf-8')
        
        # Step 1: Parse the text
        domain_model = parse_text(text) # May raise ParseError
        click.echo("Parsing successful.")
        
        # Step 2: Semantic Validation
        issues = validate_semantics(domain_model)
        
        if issues:
            click.echo(f"Found {len(issues)} semantic issues:")
            for issue in issues:
                 span = issue.span if issue.span else None
                 # Use click.echo for consistent output styling
                 if span:
                     click.secho(f"Error (Line {span.start_line}:{span.start_col}): {str(issue)}", fg='red')
                 else:
                     click.secho(f"Error: {str(issue)}", fg='red')
            sys.exit(1)
        else:
            # If parsing succeeded and no semantic issues (yet), report success
             click.secho(f"'{file.name}' validation successful.", fg='green')
            
    except ParseError as e:
        # Use click.echo and styling for errors
        click.secho(f"Parse Error in '{file.name}':", fg='red')
        click.secho(f"  Line {e.line}:{e.column}: {e.msg}", fg='red')
        # Optionally print context if available in error
        # click.echo(f"  Context: {e.context}") 
        sys.exit(1)
    except RegelspraakError as e: # Catch other specific errors if needed
        click.secho(f"Error during validation: {e}", fg='red')
        sys.exit(1)
    except Exception as e:
        # Catch unexpected errors
        click.secho(f"Unexpected Error during validation: {e}", fg='red', err=True)
        sys.exit(1)

@cli.command()
@click.argument("file", type=click.Path(exists=True, path_type=pathlib.Path))
@click.option('--data', type=click.Path(exists=True, path_type=pathlib.Path), 
              help='Path to JSON file with parameters and initial instances.')
# @click.option('--trace', type=click.Choice(['print', 'json', 'none'], case_sensitive=False), default='print', help='Trace output format.')
def run(file: pathlib.Path, data: Optional[pathlib.Path]):
    """Parse and execute a RegelSpraak file, optionally loading data."""
    click.echo(f"Running {file.name}...")
    if data:
        click.echo(f"Loading data from {data.name}...")
        
    try:
        text = file.read_text(encoding='utf-8')
        domain_model = parse_text(text)
        click.echo("Parsing successful.")
        
        # Semantic validation
        semantic_errors = validate_semantics(domain_model)
        if semantic_errors:
            click.echo(f"Found {len(semantic_errors)} semantic errors:")
            for error in semantic_errors:
                span = error.span if error.span else None
                if span:
                    click.secho(f"Error (Line {span.start_line}:{span.start_col}): {str(error)}", fg='red')
                else:
                    click.secho(f"Error: {str(error)}", fg='red')
            click.secho("Cannot execute due to semantic errors.", fg='red')
            sys.exit(1)
        click.echo("Semantic validation successful.")
        
        # Setup runtime
        trace_sink = PrintTraceSink() # Use PrintTraceSink by default
        context = RuntimeContext(domain_model, trace_sink=trace_sink)
        click.echo("Runtime context created.")

        # Load data from JSON file if provided
        if data:
            try:
                with data.open('r', encoding='utf-8') as f:
                    input_data = json.load(f)
            except json.JSONDecodeError as e:
                # Re-raise as RuntimeError to be caught by the outer handler
                raise RuntimeError(f"Error decoding JSON data file '{data.name}': {e}")
            except Exception as e:
                # Re-raise as RuntimeError to be caught by the outer handler
                 raise RuntimeError(f"Error reading data file '{data.name}': {e}")

            # Use the centralized load_from_dict method
            context.load_from_dict(input_data)
            
            # Report what was loaded
            param_count = len(input_data.get("parameters", {}))
            instance_count = len(input_data.get("instances", []))
            relationship_count = len(input_data.get("relationships", []))
            
            if param_count > 0:
                click.echo(f"Loaded {param_count} parameters")
            if instance_count > 0:
                click.echo(f"Loaded {instance_count} instances")
            if relationship_count > 0:
                click.echo(f"Loaded {relationship_count} relationships")
        
        # Execute
        evaluator = Evaluator(context)
        click.echo("Executing model...")
        evaluator.execute_model(domain_model) 
        
        click.secho("\nExecution finished.", fg='green')
        
        click.echo("\nFinal Runtime Context State (raw):")
        click.echo(f"  Parameters: {context.parameters}")
        # Use the user-confirmed attribute name 'instances'
        click.echo(f"  Instances: {context.instances}") 

    except RegelspraakError as e: # Outer except block handles errors, including re-raised ones
        click.secho(f"Runtime Error: {e}", fg='red')
        sys.exit(1)
    except Exception as e:
        click.secho(f"Unexpected Error during run: {e}", fg='red', err=True)
        sys.exit(1)

@cli.command()
def repl():
    """Start an interactive RegelSpraak REPL session."""
    # Import here to avoid circular imports
    from .repl import start_repl
    start_repl()

# Entry point for script execution (e.g., if run directly)
if __name__ == '__main__':
    cli()
