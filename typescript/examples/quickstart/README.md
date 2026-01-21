# Quickstart Examples

These examples demonstrate the core features of the RegelSpraak parser and execution engine.

## Running Examples

From the `typescript` directory:

```bash
# Compile first
npm run build

# Then run any example
npx ts-node examples/quickstart/01-simple-expression.ts
npx ts-node examples/quickstart/02-decision-table.ts
npx ts-node examples/quickstart/03-objects-and-rules.ts
npx ts-node examples/quickstart/04-relationships.ts
npx ts-node examples/quickstart/05-units.ts
```

## Examples Overview

### 01 - Simple Expressions
Basic arithmetic, functions, comparisons, and rounding.

### 02 - Decision Tables
Define and execute decision tables (Beslistabel) with single and multiple conditions.

### 03 - Objects and Rules
Create object types (Objecttype), define business rules (Regel), and execute them.

### 04 - Relationships
Use Feittype to define relationships between objects and aggregate across them.

### 05 - Units
Define unit systems (Eenheidsysteem) and perform calculations with units.

## Key Concepts

### Engine
The main entry point for parsing and executing RegelSpraak code.

```typescript
import { Engine, Context } from '../src';

const engine = new Engine();

// Simple expression
const result = engine.run('10 plus 5');

// Parse a model
const parseResult = engine.parseModel(regelspraakCode);

// Execute rules
engine.execute(parseResult.model, context);
```

### Context
Holds runtime state: variables, objects, and relationships.

```typescript
const context = new Context(model);

// Set variables
context.setVariable('x', { type: 'number', value: 42 });

// Create objects
const obj = context.createObject('TypeName', 'id-1', { attr: { type: 'number', value: 10 } });

// Create relationships
context.addRelationship('feittype naam', obj1, obj2, 'role');
```

### Value Objects
All values use a consistent structure:

```typescript
{ type: 'number', value: 42 }
{ type: 'string', value: 'hello' }
{ type: 'boolean', value: true }
{ type: 'date', value: new Date('2024-01-15') }
{ type: 'percentage', value: 0.25 }  // 25%
```
