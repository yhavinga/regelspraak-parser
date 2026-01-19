# RegelSpraak Parser

ANTLR4-based parser for RegelSpraak v2.1.0 - a Dutch domain-specific language for business rules.

## What is RegelSpraak?

Business rules as they should be: readable, verifiable, executable.

Traditional code for Dutch flight tax calculation:
```python
def calculate_tax(passenger, flight):
    tax = 0
    if flight.distance <= 2500:
        if passenger.age < 18 or (25 <= passenger.age <= 64):
            tax = 45.50 - (0.011 * flight.distance)
        # ... special cases for Easter, high season, sustainability
    elif flight.distance <= 3500:
        if passenger.age >= 65:
            tax = 22.00
        else:
            tax = 45.50 - (0.008 * flight.distance)
    # ... 40+ more lines of nested conditions
    return round(tax, 2)
```

Same logic in RegelSpraak:
```regelspraak
Regel belasting op basis van afstand
    De belasting van een passagier = het lage basistarief eerste schijf -
        het lage tarief vermindering eerste schijf × afstand
    indien afstand ≤ bovengrens eerste schijf en
        (minderjarig of een passagier van 25 tot en met 64 jaar).
```

The entire Dutch TOKA flight tax law: 291 lines of RegelSpraak. Readable by lawmakers, executable by computers.

## Why RegelSpraak Over Code?

| Traditional Programming | RegelSpraak |
|------------------------|-------------|
| 100+ lines of if-else chains | 10 lines of business rules |
| Unit errors cause Mars Climate Orbiter crashes | Units enforced: `km × EUR/km = EUR` |
| "What does this calculate?" requires code analysis | Rules read like requirements |
| Change requires developer + testing | Domain experts validate directly |
| Temporal logic requires complex state management | Built-in timeline support: `voor elke dag` |

Real example: The entire TOKA implementation including tax calculation, treinmiles distribution, and decision tables is 291 lines of RegelSpraak vs ~3000 lines of Java.

## Installation

### Python

```bash
pip install .
```

Or from built wheel:
```bash
pip install dist/regelspraak-0.2.0-py3-none-any.whl
```

### TypeScript

```bash
cd typescript
npm install
npm run build
```

## Usage

### TypeScript

**Programmatic API:**

```typescript
import { Engine, Context } from 'regelspraak';

const engine = new Engine();

const result = engine.parseModel(`
    Objecttype Passagier
        de leeftijd Numeriek;
        is minderjarig kenmerk;

    Regel minderjarig
        Een passagier is minderjarig indien zijn leeftijd < 18.
`);

const context = new Context(result.model);
context.createObject('Passagier', 'p1', { leeftijd: { type: 'number', value: 15 } });

engine.execute(result.model, context);
// Passagier p1 now has kenmerk 'minderjarig' = true
```

**CLI (for coding agents):**

```bash
# Validate RegelSpraak files
npx regelspraak validate rules.rs

# Execute rules with JSON input data
npx regelspraak run rules.rs --data input.json > output.json
```

### Python

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

**Programmatic API:**

```python
from regelspraak import parse_text, RuntimeContext, RuntimeObject, Evaluator

# TOKA flight tax rules
model = parse_text("""
    Objecttype Passagier
        de leeftijd Numeriek met eenheid jr;
        is minderjarig kenmerk;
        de belasting Bedrag;

    Objecttype Vlucht
        de afstand Numeriek met eenheid km;

    Regel minderjarig
        Een passagier is minderjarig indien zijn leeftijd < 18 jr.

    Regel belasting berekening
        De belasting van een passagier =
            0 EUR indien minderjarig,
            anders afstand van zijn vlucht × 0.10 EUR/km.
""")

# Execute for specific passenger
context = RuntimeContext(domain_model=model)
evaluator = Evaluator(context)

passagier = RuntimeObject("Passagier", "p1")
context.add_object(passagier)
context.set_attribute(passagier, "leeftijd", 15)
context.set_attribute(passagier, "vlucht", flight_ref)  # Link to flight

evaluator.execute_model(model)
print(passagier.attributen["belasting"].value)  # 0 EUR (minor pays no tax)
```

**REPL Session Example:**

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

## Advanced: Distribution Rules

RegelSpraak handles complex allocations declaratively - a feature that would require hundreds of lines of imperative code:

```regelspraak
Regel verdeling treinmiles op basis van leeftijd
    Het totaal aantal treinmiles wordt verdeeld over alle passagiers:
    - op volgorde van toenemende leeftijd
    - bij gelijke leeftijd naar rato van woonregio factor
    - met maximum 1000 per persoon
    - afgerond naar beneden.
```

No loops. No sorting. No rounding errors. Just business logic.

## Real-World Power: TOKA Implementation

The complete Dutch flight tax system including:
- **Tax calculation**: Distance/age-based progressive rates with unit safety
- **Decision tables**: Travel duration brackets mapped to tax percentages
- **Temporal rules**: `voor elke dag` - taxes that vary by date
- **Filtered aggregation**: `som van belasting van alle passagiers die minderjarig zijn`
- **Distribution logic**: Fair allocation of treinmiles based on complex criteria

All in 291 lines of auditable RegelSpraak vs thousands of lines of Java/Python.

## Project Structure

```
regelspraak-parser/
├── grammar/                # ANTLR grammar (source of truth)
├── src/regelspraak/        # Python implementation
├── typescript/src/         # TypeScript implementation
├── tests/                  # 570+ unit tests
└── specification/          # Language specification v2.1.0
```

## Documentation

- **System Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Development Roadmap**: See [ROADMAP.md](ROADMAP.md)
- **Grammar Implementation**: See [GRAMMAR_IMPLEMENTATION_NOTES.md](GRAMMAR_IMPLEMENTATION_NOTES.md)
- **Language Specification**: See `specification/` directory

## Testing

```bash
make test
# or
python -m unittest discover -s tests
```

## Development

Grammar changes require Java and ANTLR:

```bash
# One-time setup: download ANTLR
mkdir -p lib
curl -o lib/antlr-4.13.1-complete.jar https://www.antlr.org/download/antlr-4.13.1-complete.jar

# Regenerate parsers after editing grammar/*.g4
make parser
```

## Features Implemented

- All rule types (Gelijkstelling, Kenmerktoekenning, Consistentie, etc.)
- Decision tables (Beslistabel) and distribution rules (Verdeling)
- Object relationships (Feittype) and creation rules
- Timeline expressions and dimensions
- Filtered collections (Subselectie) and recursion
- Advanced predicates (elfproef, dagsoort, uniqueness)
- Compound predicates with quantifiers
- All aggregation functions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`make test`)
4. Commit changes (`git commit -m 'Add feature'`)
5. Push and open a Pull Request

## License

Apache License 2.0 - see [LICENSE](LICENSE) file.