# TOKA (Wet Treinen Op Korte Afstand) Case Study

## Overview

TOKA is a comprehensive case study demonstrating the capabilities of the RegelSpraak parser and execution engine. It implements a fictive Dutch law that taxes short flights to encourage train travel.

The TOKA law consists of two main components:
1. **TOKA Tax**: Tax on flights based on distance, train accessibility, passenger age, and sustainability factors
2. **Treinmiles**: Points distributed to passengers that can be used for public transport

## Structure

```
toka/
├── gegevens.rs          # Object types, domains, parameters, and fact types
├── regels.rs            # Business rules for tax calculation and treinmiles distribution
├── run_toka.py          # Python runner for executing scenarios
├── scenarios/           # Test scenarios in JSON format
│   ├── simple.json      # Single passenger basic tax calculation
│   ├── multiple_passengers.json  # Multiple passengers with different ages
│   ├── sustainability.json        # Sustainable flight with discounts
│   └── distribution.json         # Complex treinmiles distribution
└── README.md            # This file
```

## Running the Examples

### Prerequisites

Make sure you're in the regelspraak-parser directory and have the parser installed:

```bash
cd /path/to/regelspraak-parser
```

### Execute a Scenario

Run a specific scenario using the Python runner:

```bash
# Simple scenario with single passenger
python examples/toka/run_toka.py simple

# Multiple passengers scenario
python examples/toka/run_toka.py multiple_passengers

# Sustainability discounts scenario
python examples/toka/run_toka.py sustainability

# Complex treinmiles distribution
python examples/toka/run_toka.py distribution

# With verbose output to see rule execution trace
python examples/toka/run_toka.py simple --verbose

# Save results to JSON file
python examples/toka/run_toka.py simple --output results.json
```

### Using the CLI

You can also run TOKA rules directly using the RegelSpraak CLI:

```bash
# Validate the rules
python -m regelspraak validate examples/toka/gegevens.rs
python -m regelspraak validate examples/toka/regels.rs

# Run with a scenario (requires custom data loader)
python -m regelspraak run <combined_rules.rs> --data <scenario.json>
```

## Key Features Demonstrated

### 1. Object Types and Relationships
- **Natuurlijk persoon**: Passengers with age, residence, and tax attributes
- **Vlucht**: Flights with distance, accessibility, and sustainability properties
- **Contingent treinmiles**: Distribution containers for treinmiles points
- **Feittypes**: Relationships between passengers and flights

### 2. Age Calculation and Categorization
- Automatic age calculation using `tijdsduur` between birth date and flight date
- Age category assignment (minor, 18-24, 25-64, 65+)
- Age-based tax rules

### 3. Tax Calculation
- Distance-based taxation with brackets
- Travel time-based adjustments
- Sustainability discounts for eco-friendly flights
- Senior citizen benefits

### 4. Aggregation Functions
- Count passengers on flights
- Sum taxes across all passengers
- Find oldest passenger

### 5. Decision Tables (Beslistabellen)
- Woonregio factor based on province
- Travel duration tax percentages

### 6. Treinmiles Distribution
- Equal distribution among passengers
- Distribution by residence region factor
- Complex distribution with age priority and maximum limits

### 7. Consistency Checks
- Prevent round-trip flights (departure ≠ destination)

### 8. Date/Time Operations
- Easter holiday detection
- High season determination (June-August)
- Christmas day identification

## Scenario Details

### Simple Scenario
Tests basic tax calculation for a single adult passenger on a short flight from Amsterdam to London.

### Multiple Passengers Scenario
Demonstrates:
- Different age categories (child, young adult, adult, senior)
- Regional factor variations
- Aggregation of total taxes

### Sustainability Scenario
Shows:
- Sustainable flight detection
- Discount application for eco-friendly flights
- Senior citizen discount eligibility

### Distribution Scenario
Complex test of treinmiles distribution with:
- Age-based priority ordering
- Regional factor weighting
- Maximum limit enforcement
- Remainder handling

## Implementation Notes

1. **Rule Execution Order**: Rules execute in dependency order - age calculation first, then characteristics, then tax calculation, finally aggregation and distribution.

2. **Empty Value Handling**: The implementation correctly handles empty collections (e.g., flights with no passengers).

3. **Unit Support**: All numeric values maintain their units (km, minutes, euros, years).

4. **Tracing**: Use `--verbose` flag to see detailed execution trace for debugging.

## Extending the Example

To add new scenarios:

1. Create a new JSON file in `scenarios/` directory
2. Define parameters, objects, relationships, and expected results
3. Run using: `python examples/toka/run_toka.py <your_scenario_name>`

To modify rules:

1. Edit `gegevens.rs` for data model changes
2. Edit `regels.rs` for business logic changes
3. Test changes with existing scenarios

## Technical Details

The TOKA implementation uses:
- ANTLR4-based parser for RegelSpraak syntax
- AST-based semantic analysis
- Runtime context for object management
- Rule evaluator with dependency resolution
- Value objects with unit tracking

This example serves as both an integration test for the RegelSpraak parser and a practical demonstration of how to implement complex business rules in RegelSpraak.