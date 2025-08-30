# TOKA Navigation and Evaluation Errors - REVISED Root Cause Analysis
## Ultra-Critical Analysis - 2025-08-29

## THE REAL ROOT CAUSE (Found through deep investigation)

### Primary Issue: Instances Not Initialized with All Attributes

**Discovery**: After deep code analysis, the ACTUAL root cause is that RuntimeObject instances are created with empty `attributen` dictionaries. Only attributes provided in input data are set. Calculated attributes don't exist at all.

**Evidence**:
```python
# In run_toka.py line 145:
passenger = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id=passenger_data['id'])
# This creates an object with attributen = {} (empty dict)

# Then only specific attributes from input are set:
self.context.set_attribute(passenger, 'geboortedatum', ...)  # Set from input
# But 'belasting op basis van afstand' is NEVER created!
```

**Why This Matters**: 
- The engine code at lines 1860-1865 CORRECTLY handles ['self', 'attribute'] paths
- But `get_attribute` fails because the attribute literally doesn't exist in the instance
- Error: "Attribute 'belasting op basis van afstand' not found on instance"

### Secondary Issues (Still Valid)

1. **Navigation "X van de Y"** - Partially fixed but not fully working
2. **Aggregation navigation** - Functions look for attributes on wrong object
3. **Decision table navigation** - Can't navigate across relationships  
4. **Object creation parsing** - Wrong type name extracted
5. **Context-type paths** - Need special handling for ['vlucht', 'attribute'] patterns

## The Correct Solution

### Option 1: Initialize All Attributes (RECOMMENDED)
When creating a RuntimeObject, pre-populate ALL attributes from the ObjectType definition:

```python
def create_runtime_object(object_type: ObjectType, instance_id: str) -> RuntimeObject:
    obj = RuntimeObject(object_type_naam=object_type.naam, instance_id=instance_id)
    # Initialize ALL attributes with empty/null values
    for attr_name, attr_def in object_type.attributen.items():
        obj.attributen[attr_name] = Value(None, attr_def.datatype, attr_def.unit)
    return obj
```

### Option 2: Lazy Attribute Creation
Modify `get_attribute` to create missing attributes on-demand:

```python
def get_attribute(self, instance: RuntimeObject, attr_name: str) -> Value:
    if attr_name not in instance.attributen:
        # Check if this attribute is defined in the object type
        obj_type = self.domain_model.objecttypes.get(instance.object_type_naam)
        if obj_type and attr_name in obj_type.attributen:
            # Create with null value
            attr_def = obj_type.attributen[attr_name]
            instance.attributen[attr_name] = Value(None, attr_def.datatype, attr_def.unit)
        else:
            raise RuntimeError(f"Attribute '{attr_name}' not found...")
    return instance.attributen.get(attr_name)
```

## Revised Implementation Priority

1. **Fix attribute initialization** (CRITICAL - nothing works without this)
2. **Fix self-reference resolution** (Already mostly working, needs minor tweaks)
3. **Fix aggregation navigation** (High priority)
4. **Fix decision table navigation** (High priority)
5. **Fix object creation parsing** (Medium priority)

## Key Insight

The engine has sophisticated navigation code that ALREADY handles most cases correctly. The main issue is that **attributes don't exist on instances** rather than navigation failing. Once attributes are properly initialized, many "navigation" errors will disappear.

## Testing Strategy

After implementing attribute initialization:
```bash
cd examples/toka && python run_toka.py simple 2>&1 | grep -c "Error"
# Should drop from ~7 errors to ~3-4 errors
```

## The Carmack Take

"Everyone was debugging the wrong layer. The navigation code is fine. The AST is fine. The problem is the data model - instances aren't being properly initialized. Fix the foundation first."