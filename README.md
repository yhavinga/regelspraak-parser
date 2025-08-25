# RegelSpraak Parser

> [!WARNING]
> **EXPERIMENTAL, WORK IN PROGRESS.** This parser is under active development.

ANTLR4-based parser for RegelSpraak v2.1.0 - a Dutch domain-specific language for business rules. Implements **98-99%** of the specification with **487 Python tests** and **454 TypeScript tests** passing.

## What is RegelSpraak?

RegelSpraak allows Dutch-speaking domain experts to express business rules in natural language:

```regelspraak
Regel Minderjarigheid voor alle personen
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.
```

## Quick Start

### Installation

```bash
# Install dependencies and package
pip install -r requirements.txt
pip install -e .  # For development

# For grammar modifications only:
# Download ANTLR 4.13.1 and run: make parser
```

### Basic Usage

**CLI Validation:**
```bash
python -m regelspraak validate rules.rs
```

**Run Rules with Data:**
```bash
python -m regelspraak run rules.rs --data initial_data.json
```

**Interactive REPL:**
```bash
python -m regelspraak

RegelSpraak REPL v0.1.0
Type ':help' for commands, ':quit' to exit
RegelSpraak>
```

Key REPL features:
- `:load <file.rs>` - Load RegelSpraak definitions
- `:show ctx` - Display current state (parameters, objects, rules)
- `:trace on/off` - Enable/disable execution tracing
- `:reset` - Clear session state
- `py: <code>` - Execute Python (access `context`, `RuntimeObject`, `Value`)
- `Evaluate <instance> is <kenmerk>` - Quick expression evaluation

### Programmatic API

```python
from regelspraak import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.engine import Evaluator

# Parse rules
model = parse_text("""
    Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;
    
    Objecttype de Natuurlijk persoon
        is minderjarig kenmerk (bijvoeglijk);
        de leeftijd Numeriek (geheel getal) met eenheid jr;
    
    Regel Minderjarigheid
        geldig altijd
            Een Natuurlijk persoon is minderjarig
            indien zijn leeftijd kleiner is dan de volwassenleeftijd.
""")

# Create runtime
context = RuntimeContext(domain_model=model)
context.set_parameter("volwassenleeftijd", 18, unit="jr")

# Add instance
person = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p1")
context.add_object(person)
context.set_attribute(person, "leeftijd", 15)

# Execute rules
evaluator = Evaluator(context)
evaluator.execute_model(model)

# Check results
print(person.kenmerken["minderjarig"])  # True
```

### REPL Session Example

```
RegelSpraak> :load tests/resources/steelthread_example.rs
Loaded and merged model from tests/resources/steelthread_example.rs

RegelSpraak> py: context.set_parameter('volwassenleeftijd', 18, unit='jr')

RegelSpraak> py: p1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
RegelSpraak> py: context.add_object(p1)
RegelSpraak> py: context.set_attribute(p1, 'leeftijd', 15)

RegelSpraak> py: evaluator.execute_model(domain_model)
TRACE: (Line 7) RULE_FIRED - rule_name='Kenmerktoekenning persoon minderjarig'

RegelSpraak> Evaluate p1 is minderjarig
waar
```

## Advanced Examples

### Filtered Collections (Subselectie)

Filter collections using natural Dutch predicates with "die/dat":

```regelspraak
Regel totale belasting minderjarigen
    geldig altijd
        De totale belasting minderjarigen van een vlucht moet berekend worden als 
        de som van de belasting van alle passagiers van de vlucht die minderjarig zijn.
```

### Unit-Aware Arithmetic

The engine preserves units through calculations and validates unit compatibility:

```regelspraak
Parameter de maximum snelheid : Numeriek (getal) met eenheid km/u;

Regel boete berekening
    geldig altijd
        De boete van een bestuurder moet berekend worden als
        (zijn gemeten snelheid min het maximum snelheid) maal 10 EUR per km/u.
```

Result: If speed is 120 km/u and limit is 100 km/u, boete = (20 km/u) × (10 EUR per km/u) = 200 EUR

### Multi-Dimensional Attributes

Support for attributes indexed by multiple dimensions:

```regelspraak
Dimensie de jaardimensie met waarden: huidig jaar, vorig jaar;

Objecttype de Natuurlijk persoon
    het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie;

Regel bereken gemiddeld inkomen
    geldig altijd
        Het gemiddeld inkomen van een persoon moet berekend worden als
        (het inkomen van huidig jaar plus het inkomen van vorig jaar) gedeeld door 2.
```

## Project Structure

```
regelspraak-parser/
├── grammar/                # ANTLR grammar files
├── src/regelspraak/        # Core implementation
│   ├── parsing.py         # Parser facade (4KB)
│   ├── builder.py         # AST builder (180KB - needs splitting)
│   ├── ast.py             # AST nodes
│   ├── engine.py          # Execution engine (339KB - needs splitting)
│   ├── runtime.py         # Runtime data structures
│   └── cli.py             # Command-line interface
├── tests/                  # 439+ unit tests
└── specification/          # Language specification
```

## Documentation

- **Architecture & Roadmap**: See [20250725_CODEBASE_STATUS.md](20250725_CODEBASE_STATUS.md)
- **Grammar Implementation**: See [GRAMMAR_IMPLEMENTATION_NOTES.md](GRAMMAR_IMPLEMENTATION_NOTES.md)
- **Language Specification**: See `specification/` directory

## Testing

```bash
make test
# or
python -m unittest discover -s tests
```

## Features Implemented

- ✅ All rule types (Gelijkstelling, Kenmerktoekenning, Consistentie, etc.)
- ✅ Decision tables (Beslistabel) and distribution rules (Verdeling)
- ✅ Object relationships (Feittype) and creation rules
- ✅ Timeline expressions and dimensions
- ✅ Filtered collections (Subselectie) and recursion
- ✅ Advanced predicates (elfproef, dagsoort, uniqueness)
- ✅ Compound predicates with quantifiers
- ✅ All aggregation functions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`make test`)
4. Commit changes (`git commit -m 'Add feature'`)
5. Push and open a Pull Request

## License

Apache License 2.0 - see [LICENSE](LICENSE) file.