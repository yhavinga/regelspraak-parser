"""RegelSpraak interactive REPL (Read-Eval-Print Loop)."""
import os
import sys
from typing import Optional, Dict, Any, List, Tuple
import traceback

# Core components
from .parsing import parse_text
from .ast import DomainModel, SourceSpan
from .runtime import RuntimeContext, RuntimeObject, Value
from .engine import Evaluator, PrintTraceSink
from .errors import RegelspraakError, ParseError

# Optional: For better CLI experience
try:
    from prompt_toolkit import PromptSession
    from prompt_toolkit.history import FileHistory
    from prompt_toolkit.auto_suggest import AutoSuggestFromHistory
    HAVE_PROMPT_TOOLKIT = True
except ImportError:
    HAVE_PROMPT_TOOLKIT = False

class ReplState:
    """Maintains state across REPL interactions."""
    
    def __init__(self):
        self.domain_model = DomainModel(
            span=SourceSpan.unknown(),
            parameters={}, 
            objecttypes={}, 
            regels=[]
        )
        self.context = RuntimeContext(self.domain_model, trace_sink=PrintTraceSink())
        self.evaluator = Evaluator(self.context)
        self.current_module_name = "unnamed"
        self.variables = {}  # Python variables for py: commands
    
    def reset(self):
        """Reset the state to initial values."""
        self.__init__()
    
    def merge_model(self, new_model: DomainModel) -> None:
        """Merge a new DomainModel into the current one."""
        # Parameters and ObjectTypes (dictionaries)
        for name, param in new_model.parameters.items():
            self.domain_model.parameters[name] = param
            
        for name, obj_type in new_model.objecttypes.items():
            self.domain_model.objecttypes[name] = obj_type
            
        # Regels (list, not dict)
        for regel in new_model.regels:
            self.domain_model.regels.append(regel)
        
        # Update context with new model
        self.context = RuntimeContext(self.domain_model, trace_sink=self.context.trace_sink)
        self.evaluator = Evaluator(self.context)

def start_repl():
    """Start the REPL session."""
    state = ReplState()
    
    # Use prompt_toolkit if available, otherwise fallback to input()
    if HAVE_PROMPT_TOOLKIT:
        history_file = os.path.expanduser("~/.regelspraak_history")
        session = PromptSession(
            history=FileHistory(history_file),
            auto_suggest=AutoSuggestFromHistory()
        )
    
    print("RegelSpraak REPL v0.1.0")
    print("Type ':help' for commands, ':quit' to exit")
    print("Use '.' on a newline to end multi-line input")
    
    while True:
        try:
            # Get initial input
            if HAVE_PROMPT_TOOLKIT:
                line = session.prompt("RegelSpraak> ")
            else:
                line = input("RegelSpraak> ")
                
            # Process commands
            if line.startswith(':'):
                handle_command(line, state)
                continue
                
            if line.startswith('py:'):
                handle_python(line[3:].strip(), state)
                continue
                
            if line.startswith('Evaluate '):
                handle_evaluate(line[9:].strip(), state)
                continue
                
            # Multi-line input for RegelSpraak code
            text = [line]
            while True:
                if HAVE_PROMPT_TOOLKIT:
                    next_line = session.prompt(">>> ")
                else:
                    next_line = input(">>> ")
                    
                if next_line.strip() == '.':
                    break
                    
                text.append(next_line)
            
            # Parse and process RegelSpraak code
            parse_and_process(text, state)
                
        except KeyboardInterrupt:
            print("\nUse ':quit' to exit")
        except EOFError:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"Error: {type(e).__name__}: {e}")
            traceback.print_exc()

def handle_command(cmd: str, state: ReplState) -> None:
    """Handle REPL meta-commands starting with ':'."""
    cmd = cmd[1:].strip()  # Remove the : prefix
    
    if cmd in ('q', 'quit', 'exit'):
        print("Exiting...")
        sys.exit(0)
    
    elif cmd == 'help':
        print_help()
    
    elif cmd == 'reset':
        state.reset()
        print("State reset.")
    
    elif cmd.startswith('load '):
        filename = cmd[5:].strip()
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                text = f.read()
            model = parse_text(text)
            state.merge_model(model)
            print(f"Loaded and merged model from {filename}")
        except Exception as e:
            print(f"Error loading file: {e}")
    
    elif cmd == 'show ctx':
        show_context(state)
    
    elif cmd.startswith('trace '):
        subcommand = cmd[6:].strip()
        if subcommand == 'on':
            state.context.trace_sink = PrintTraceSink()
            print("Tracing enabled.")
        elif subcommand == 'off':
            state.context.trace_sink = None
            print("Tracing disabled.")
        else:
            print(f"Unknown trace option: {subcommand}")
    
    else:
        print(f"Unknown command: {cmd}")
        print("Type ':help' for available commands")

def handle_python(code: str, state: ReplState) -> None:
    """Execute Python code with access to the REPL state."""
    # Create locals dict with access to key objects
    locals_dict = {
        'context': state.context,
        'evaluator': state.evaluator,
        'domain_model': state.domain_model,
        'parse_text': parse_text,
        'RuntimeObject': RuntimeObject,
        'Value': Value,
        # Add helper functions to match expected API in tests
        'create_instance': lambda type_name, instance_id=None: create_instance_helper(state.context, type_name, instance_id),
    }
    # Add state's variables
    locals_dict.update(state.variables)
    
    try:
        # Execute the code
        exec(code, globals(), locals_dict)
        # Update state's variables with any new ones from locals_dict
        for key, value in locals_dict.items():
            if key not in ('context', 'evaluator', 'domain_model', 'parse_text', 'RuntimeObject', 'Value', 'create_instance'):
                state.variables[key] = value
    except Exception as e:
        print(f"Python execution error: {e}")

# Helper functions to match expected API in tests
def create_instance_helper(context, type_name, instance_id=None):
    """Helper function to create and add an instance to the context."""
    obj = RuntimeObject(object_type_naam=type_name, instance_id=instance_id)
    context.add_object(obj)
    return obj

def handle_evaluate(expr: str, state: ReplState) -> None:
    """Evaluate an expression like 'p1 is minderjarig'."""
    try:
        # Parse into tokens (simplified approach - would need real parsing)
        # Example: "p1 is minderjarig" -> (instance_id="p1", kenmerk="minderjarig")
        parts = expr.split()
        if 'is' in parts and len(parts) >= 3:
            instance_id = parts[0]
            kenmerk = parts[-1]
            
            # Find the instance
            instance = None
            for type_instances in state.context.instances.values():
                for obj in type_instances:
                    if obj.instance_id == instance_id:
                        instance = obj
                        break
                if instance:
                    break
            
            if not instance:
                print(f"Instance '{instance_id}' not found")
                return
            
            # Check for kenmerk
            result = state.context.get_kenmerk(instance, kenmerk)
            print(f"{'waar' if result else 'onwaar'}")
            
        else:
            print("Invalid evaluate expression. Format: 'Evaluate <instance> is <kenmerk>'")
    except Exception as e:
        print(f"Evaluation error: {e}")

def parse_and_process(lines: List[str], state: ReplState) -> None:
    """Parse and process RegelSpraak code."""
    text = '\n'.join(lines)
    try:
        # Parse text into domain model
        model = parse_text(text)
        # Merge into current model
        state.merge_model(model)
        # Execute any rules that were added
        state.evaluator.execute_model(model)
        print("Parsed and executed successfully.")
    except ParseError as e:
        print(f"Parse error: {e}")
    except RegelspraakError as e:
        print(f"RegelSpraak error: {e}")
    except Exception as e:
        print(f"Error: {e}")

def show_context(state: ReplState) -> None:
    """Display current context information."""
    print(f"Parameters: {len(state.domain_model.parameters)}")
    for name in state.domain_model.parameters:
        print(f"  {name}")
    
    print(f"Object Types: {len(state.domain_model.objecttypes)}")
    for name in state.domain_model.objecttypes:
        print(f"  {name}")
    
    print(f"Rules: {len(state.domain_model.regels)}")
    for name in state.domain_model.regels:
        print(f"  {name}")
    
    print(f"Runtime Instances: {sum(len(instances) for instances in state.context.instances.values())}")
    for type_name, instances in state.context.instances.items():
        print(f"  {type_name}: {len(instances)}")
        for instance in instances:
            print(f"    {instance.instance_id}")

def print_help() -> None:
    """Print REPL help information."""
    print("RegelSpraak REPL Commands:")
    print("  :help                Show this help")
    print("  :quit, :q, :exit     Exit the REPL")
    print("  :reset               Reset the current state")
    print("  :load <filename>     Load RegelSpraak code from file")
    print("  :show ctx            Show current context state")
    print("  :trace on|off        Enable/disable execution tracing")
    print()
    print("Special Input Formats:")
    print("  py: <code>           Execute Python code")
    print("  Evaluate <expr>      Evaluate expression (e.g., 'p1 is minderjarig')")
    print("  <regelspraak code>   Enter RegelSpraak code (end with '.' on empty line)")