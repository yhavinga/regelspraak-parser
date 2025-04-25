import click
import sys
import pathlib
import json
from typing import Optional
from .parsing import parse_text
# from .semantics import validate as validate_semantics # Import later
from .errors import RegelspraakError, ParseError, RuntimeError # Added RuntimeError
from .runtime import RuntimeContext, Value, RuntimeObject # Added Value, RuntimeObject
from .engine import Evaluator, PrintTraceSink

@click.group()
def cli():
    """RegelSpraak Parser & Engine CLI."""
    pass

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
        
        # Step 2: Semantic Validation (Placeholder)
        # issues = validate_semantics(domain_model) # Implement later
        issues = [] # Placeholder
        
        if issues:
            click.echo(f"Found {len(issues)} semantic issues:")
            for issue in issues:
                 span = issue.span
                 # Use click.echo for consistent output styling
                 click.secho(f"Error (Line {span.start_line}:{span.start_col}): {issue.message}", fg='red')
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
        # TODO: Add semantic validation step here?
        
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

            # Load Parameters
            if "parameters" in input_data and isinstance(input_data["parameters"], dict):
                click.echo("Loading parameters...")
                for param_name, raw_value in input_data["parameters"].items():
                    # Access definition via dictionary lookup
                    param_def = domain_model.parameters.get(param_name)
                    if param_def:
                        # TODO: Add type checking/conversion raw_value vs param_def.datatype?
                        # Use param_def.eenheid from Parameter definition
                        param_value = Value(value=raw_value, datatype=param_def.datatype, eenheid=param_def.eenheid)
                        context.add_parameter(param_name, param_value)
                        click.echo(f"  Loaded parameter '{param_name}' = {raw_value}")
                    else:
                        click.secho(f"  Warning: Parameter '{param_name}' defined in data but not found in model. Skipping.", fg='yellow')
            
            # Load Instances
            if "instances" in input_data and isinstance(input_data["instances"], list):
                click.echo("Loading instances...")
                for instance_data in input_data["instances"]:
                    if not isinstance(instance_data, dict) or "object_type_naam" not in instance_data:
                        # Raise RuntimeError instead of just warning and continuing
                        raise RuntimeError(f"Invalid instance data format found in '{data.name}': Expected dictionary with 'object_type_naam', got {type(instance_data)}. Data: {instance_data!r}")
                        # click.secho("  Warning: Invalid instance data format found. Skipping.", fg='yellow')
                        # continue
                    
                    obj_type_name = instance_data["object_type_naam"]
                    instance_id = instance_data.get("instance_id") # Optional
                    
                    # Ensure object type exists in the model via dictionary lookup
                    obj_type_def = domain_model.objecttypes.get(obj_type_name)
                    if not obj_type_def:
                        # Raise error if object type not found but defined in data
                        raise RuntimeError(f"ObjectType '{obj_type_name}' defined in data file '{data.name}' but not found in model.")
                        # click.secho(f"  Warning: ObjectType '{obj_type_name}' defined in data but not found in model. Skipping instance.", fg='yellow')
                        # continue

                    # Create RuntimeObject instance directly
                    new_instance = RuntimeObject(object_type_naam=obj_type_name, instance_id=instance_id)
                    # Add the created instance to the context
                    context.add_object(new_instance)
                    click.echo(f"  Created and added instance: {new_instance.instance_id} (Type: {obj_type_name})")

                    # Set attributes using context.set_attribute
                    if "attributen" in instance_data and isinstance(instance_data["attributen"], dict):
                        for attr_name, raw_value in instance_data["attributen"].items():
                            # Get attribute definition via dictionary lookup
                            attr_def = obj_type_def.attributen.get(attr_name)
                            if attr_def:
                                # TODO: Add type checking/conversion raw_value vs attr_def.datatype?
                                # Use context.set_attribute to handle value creation and tracing
                                context.set_attribute(new_instance, attr_name, raw_value) # Pass raw value
                                click.echo(f"    Set attribute '{attr_name}' = {raw_value}")
                            else:
                                click.secho(f"    Warning: Attribute '{attr_name}' defined in data for '{obj_type_name}' but not found in model. Skipping.", fg='yellow')
                    # TODO: Add loading for kenmerken if needed?
        
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

# Entry point for script execution (e.g., if run directly)
if __name__ == '__main__':
    cli()
