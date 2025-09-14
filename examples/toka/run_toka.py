#!/usr/bin/env python3
"""TOKA Example Runner - Execute TOKA case study scenarios."""

import json
import sys
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import date, datetime

# Add parent directory to path to import regelspraak
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator, PrintTraceSink
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.errors import ParseError, SemanticError, RuntimeError as RegelspraakRuntimeError


class TOKARunner:
    """Execute TOKA case study with validation."""
    
    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.toka_dir = Path(__file__).parent
        self.model = None
        self.context = None
        
    def load_rules(self) -> str:
        """Load and combine TOKA RegelSpraak files."""
        gegevens_file = self.toka_dir / "gegevens.rs"
        regels_file = self.toka_dir / "regels.rs"
        
        gegevens = gegevens_file.read_text(encoding='utf-8')
        regels = regels_file.read_text(encoding='utf-8')
        
        return f"{gegevens}\n\n{regels}"
    
    def load_scenario(self, scenario_name: str) -> Dict[str, Any]:
        """Load test scenario from JSON file."""
        scenario_file = self.toka_dir / "scenarios" / f"{scenario_name}.json"
        if not scenario_file.exists():
            raise FileNotFoundError(f"Scenario not found: {scenario_file}")
        
        with open(scenario_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def execute_scenario(self, scenario_name: str) -> Dict[str, Any]:
        """Execute a TOKA scenario and return results."""
        try:
            # Load and parse rules
            print(f"Loading TOKA rules...")
            rules_text = self.load_rules()
            self.model = parse_text(rules_text)
            print(f"✅ Successfully parsed {len(self.model.regels)} rules")
            
            # Load scenario data
            print(f"Loading scenario: {scenario_name}")
            scenario = self.load_scenario(scenario_name)
            print(f"✅ Loaded scenario: {scenario['name']}")
            
            # Create runtime context
            trace_sink = PrintTraceSink() if self.verbose else None
            self.context = RuntimeContext(self.model, trace_sink=trace_sink)
            
            # Add parameters
            self._add_parameters(scenario['parameters'])
            
            # Create objects
            self._create_objects(scenario['objects'])
            
            # Create relationships
            if 'relationships' in scenario:
                self._create_relationships(scenario['relationships'])
            
            # Execute rules
            print("Executing rules...")
            evaluator = Evaluator(self.context)
            results = evaluator.execute_model(self.model)
            print(f"✅ Rule execution completed")
            
            # Validate results if expected results provided
            validation_results = None
            if 'expected' in scenario:
                validation_results = self._validate_results(scenario['expected'])
                self._print_validation_results(validation_results)
            
            # Print final state
            self._print_final_state()
            
            return {
                'scenario': scenario_name,
                'status': 'success',
                'validation': validation_results,
                'objects': self._extract_objects_state()
            }
            
        except (ParseError, SemanticError) as e:
            print(f"❌ Parse/Semantic error: {e}")
            return {
                'scenario': scenario_name,
                'status': 'failed',
                'error': str(e)
            }
        except Exception as e:
            # Catch all other exceptions for now during development
            print(f"❌ Runtime error: {e}")
            return {
                'scenario': scenario_name,
                'status': 'failed',
                'error': str(e)
            }
    
    def _add_parameters(self, parameters: Dict[str, Any]):
        """Add parameter values to context."""
        for param_name, param_data in parameters.items():
            # Get the parameter definition from the domain model to determine datatype
            param_def = self.model.parameters.get(param_name)
            
            if isinstance(param_data, dict):
                # Parameter with value and unit
                value = param_data.get('value')
                unit = param_data.get('unit')
                # Use the parameter's defined datatype if available
                datatype = param_def.datatype if param_def else "Numeriek"
                self.context.add_parameter(
                    param_name, 
                    Value(value, datatype, unit)
                )
            else:
                # Simple parameter value
                if param_def and param_def.datatype:
                    # Use the defined datatype
                    datatype = param_def.datatype
                    # For date types, keep the value as-is (string representation)
                    value = param_data
                    # Get unit from parameter definition if available
                    unit = param_def.unit if param_def and hasattr(param_def, 'unit') else None
                elif isinstance(param_data, (int, float)):
                    datatype = "Numeriek"
                    value = param_data
                    unit = None
                else:
                    datatype = "Tekst"
                    value = param_data
                    unit = None
                    
                self.context.add_parameter(
                    param_name,
                    Value(value, datatype, unit)
                )
        
        print(f"✅ Added {len(parameters)} parameters")
    
    def _create_objects(self, objects: Dict[str, List[Dict]]):
        """Create object instances."""
        object_count = 0
        
        # Create passengers
        for passenger_data in objects.get('passengers', []):
            passenger = self.context.create_object("Natuurlijk persoon", instance_id=passenger_data['id'])
            self.context.add_object(passenger)
            
            # Set attributes
            if 'geboortedatum' in passenger_data:
                birth_date = datetime.strptime(passenger_data['geboortedatum'], '%Y-%m-%d').date()
                self.context.set_attribute(passenger, 'geboortedatum', Value(birth_date, "Datum"))
            
            if 'woonprovincie' in passenger_data:
                self.context.set_attribute(passenger, 'woonprovincie', Value(passenger_data['woonprovincie'], "Tekst"))
                
            if 'identificatienummer' in passenger_data:
                self.context.set_attribute(passenger, 'identificatienummer', 
                                          Value(passenger_data['identificatienummer'], "Numeriek"))
            
            if 'maximaal te ontvangen treinmiles' in passenger_data:
                self.context.set_attribute(passenger, 'maximaal te ontvangen treinmiles',
                                          Value(passenger_data['maximaal te ontvangen treinmiles'], "Numeriek"))
            
            object_count += 1
        
        # Create flights
        for flight_data in objects.get('flights', []):
            flight = self.context.create_object("Vlucht", instance_id=flight_data['id'])
            self.context.add_object(flight)
            
            # Set flight attributes
            for attr_name, attr_value in flight_data.items():
                if attr_name == 'id':
                    continue
                elif attr_name == 'vluchtdatum':
                    flight_date = datetime.strptime(attr_value, '%Y-%m-%d').date()
                    self.context.set_attribute(flight, 'vluchtdatum', Value(flight_date, "Datum"))
                elif attr_name == 'verwachte datum-tijd van vertrek':
                    # Handle datetime string
                    self.context.set_attribute(flight, attr_name, Value(attr_value, "Datum en tijd in millisecondes"))
                elif attr_name == 'verwachte duur':
                    # Duration in minutes
                    self.context.set_attribute(flight, attr_name, Value(attr_value, "Numeriek", "minuut"))
                elif attr_name in ['luchthaven van vertrek', 'luchthaven van bestemming']:
                    self.context.set_attribute(flight, attr_name, Value(attr_value, "Luchthavens"))
                elif attr_name == 'afstand tot bestemming':
                    self.context.set_attribute(flight, attr_name, Value(attr_value, "Numeriek", "km"))
                elif attr_name == 'reisduur per trein':
                    self.context.set_attribute(flight, attr_name, Value(attr_value, "Numeriek", "min"))
                elif isinstance(attr_value, bool):
                    self.context.set_attribute(flight, attr_name, Value(attr_value, "Boolean"))
                elif isinstance(attr_value, int):
                    self.context.set_attribute(flight, attr_name, Value(attr_value, "Numeriek"))
                else:
                    self.context.set_attribute(flight, attr_name, Value(attr_value, "Tekst"))
            
            object_count += 1
        
        print(f"✅ Created {object_count} objects")
    
    def _find_object_by_id(self, object_id: str) -> Optional[RuntimeObject]:
        """Helper to find object by instance_id."""
        for objects in self.context.instances.values():
            for obj in objects:
                if obj.instance_id == object_id:
                    return obj
        return None
    
    def _create_relationships(self, relationships: List[Dict]):
        """Create fact relationships."""
        for rel in relationships:
            if rel['type'] == 'vlucht van natuurlijke personen':
                flight = self._find_object_by_id(rel['flight_id'])
                passenger = self._find_object_by_id(rel['passenger_id'])
                
                if flight and passenger:
                    self.context.add_relationship(
                        feittype_naam="vlucht van natuurlijke personen",
                        subject=flight,
                        object=passenger,
                        preposition="VAN"
                    )
        
        print(f"✅ Created {len(relationships)} relationships")
    
    def _validate_results(self, expected: Dict[str, Dict]) -> Dict:
        """Validate execution results against expected values."""
        results = {'passed': [], 'failed': []}
        
        for object_id, expected_values in expected.items():
            obj = self._find_object_by_id(object_id)
            if not obj:
                results['failed'].append(f"Object {object_id} not found")
                continue
            
            for attr_name, expected_value in expected_values.items():
                # Check attributes
                obj_type = self.model.objecttypes.get(obj.object_type_naam)
                if obj_type and attr_name in obj_type.attributen:
                    actual = self.context.get_attribute(obj, attr_name)
                    if actual and actual.value == expected_value:
                        results['passed'].append(f"{object_id}.{attr_name}")
                    else:
                        actual_val = actual.value if actual else None
                        results['failed'].append(
                            f"{object_id}.{attr_name}: expected {expected_value}, got {actual_val}"
                        )
                # Check characteristics (kenmerken)
                elif attr_name in obj.kenmerken:
                    actual = obj.kenmerken[attr_name]
                    if actual == expected_value:
                        results['passed'].append(f"{object_id}.{attr_name}")
                    else:
                        results['failed'].append(
                            f"{object_id}.{attr_name}: expected {expected_value}, got {actual}"
                        )
        
        return results
    
    def _print_validation_results(self, results: Dict):
        """Print validation results."""
        print("\n" + "="*60)
        print("VALIDATION RESULTS")
        print("="*60)
        
        if results['passed']:
            print(f"✅ Passed: {len(results['passed'])}")
            if self.verbose:
                for item in results['passed']:
                    print(f"   - {item}")
        
        if results['failed']:
            print(f"❌ Failed: {len(results['failed'])}")
            for item in results['failed']:
                print(f"   - {item}")
    
    def _print_final_state(self):
        """Print final state of key objects."""
        print("\n" + "="*60)
        print("FINAL STATE")
        print("="*60)
        
        # Print passengers
        passengers = self.context.find_objects_by_type("Natuurlijk persoon")
        if passengers:
            print("\nPassengers:")
            for p in passengers:
                print(f"  {p.instance_id}:")
                
                # Key attributes
                age = self.context.get_attribute(p, 'leeftijd')
                if age:
                    print(f"    - leeftijd: {age.value} {age.unit}")
                
                tax = self.context.get_attribute(p, 'te betalen belasting')
                if tax:
                    print(f"    - te betalen belasting: €{tax.value}")
                
                miles = self.context.get_attribute(p, 'treinmiles op basis van evenredige verdeling')
                if miles:
                    print(f"    - treinmiles: {miles.value}")
                
                # Characteristics
                if p.kenmerken:
                    print(f"    - kenmerken: {p.kenmerken}")
        
        # Print flights
        flights = self.context.find_objects_by_type("Vlucht")
        if flights:
            print("\nFlights:")
            for f in flights:
                print(f"  {f.instance_id}:")
                
                total_tax = self.context.get_attribute(f, 'totaal te betalen belasting')
                if total_tax:
                    print(f"    - totaal te betalen belasting: €{total_tax.value}")
                
                passenger_count = self.context.get_attribute(f, 'hoeveelheid passagiers')
                if passenger_count:
                    print(f"    - hoeveelheid passagiers: {passenger_count.value}")
                
                if f.kenmerken:
                    print(f"    - kenmerken: {f.kenmerken}")
    
    def _extract_objects_state(self) -> Dict[str, Dict]:
        """Extract final state of all objects."""
        state = {}
        
        # Get all objects from all instances
        all_objects = []
        for instances in self.context.instances.values():
            all_objects.extend(instances)
        
        for obj in all_objects:
            obj_data = {
                'type': obj.object_type_naam,
                'attributes': {},
                'characteristics': dict(obj.kenmerken)
            }
            
            # Get all attributes
            obj_type = self.model.objecttypes.get(obj.object_type_naam)
            if obj_type:
                for attr_name, attr in obj_type.attributen.items():
                    value = self.context.get_attribute(obj, attr_name)
                    if value:
                        obj_data['attributes'][attr_name] = {
                            'value': value.value,
                            'unit': value.unit
                        }
            
            state[obj.instance_id] = obj_data
        
        return state


def main():
    """Main execution function."""
    import argparse
    
    parser = argparse.ArgumentParser(description="TOKA Case Study Runner")
    parser.add_argument('scenario', help='Scenario name to execute (without .json extension)')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose output')
    parser.add_argument('--debug', '-d', action='store_true', help='Enable debug logging')
    parser.add_argument('--output', '-o', help='Output file for results (JSON)')
    
    args = parser.parse_args()
    
    # Configure logging if debug flag is set
    if args.debug:
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(levelname)s - %(name)s - %(message)s'
        )
    
    runner = TOKARunner(verbose=args.verbose)
    results = runner.execute_scenario(args.scenario)
    
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, default=str)
        print(f"\n✅ Results written to {args.output}")
    
    # Exit with error if execution failed
    if results['status'] == 'failed':
        sys.exit(1)


if __name__ == "__main__":
    main()