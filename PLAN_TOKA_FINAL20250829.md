# TOKA Navigation and Evaluation Errors - Root Cause Analysis and Solution Plan
## Final Version - Data-Verified - 2025-08-29

## Executive Summary
The TOKA example execution fails due to systematic navigation and reference resolution issues in the RegelSpraak engine. These issues stem from how the engine handles attribute references, navigation patterns, and cross-object relationships.

## Data-Driven Verification (Carmack-style analysis)
All issues have been verified against actual parsed output:
- ✅ Self-reference confirmed: paths contain literal 'self' element
- ✅ Aggregation issue confirmed: functions receive attribute name without navigation
- ✅ Decision table navigation confirmed: needs cross-object attribute access  
- ✅ Object creation confirmed: wrong type name used
- ⚠️ Context paths: May be correct Dutch grammar, needs investigation

## Root Cause Analysis

### 1. Navigation Pattern "X van de Y" (PARTIALLY FIXED)

**Location**: `src/regelspraak/engine.py:7128-7205` (_resolve_collection_from_feittype)

**Root Cause**: The function had flawed logic for resolving navigation expressions. When encountering "het aantal passagiers van de reis", it couldn't properly match FeitType relationships.

**Effect**: 
- Error: "Attribute 'reis' not found on instance of 'Natuurlijk persoon'"
- Rules like "Hoeveelheid passagiers van een reis" fail

**Solution (Implemented by GPT-5)**: Fixed the `_resolve_collection_from_feittype` function to:
1. Find the context role (what the current object plays)
2. Find the target role (what we're looking for)
3. Resolve relationships correctly

**Status**: ✅ FIXED

---

### 2. Self-Reference Resolution Failure

**Location**: 
- `src/regelspraak/engine.py:1524` (evaluate_expression - primary fix)
- `src/regelspraak/engine.py:5660` (_func_het_aantal - secondary fix)

**Root Cause**: When encountering paths like `['self', 'belasting op basis van afstand']`, the engine doesn't properly resolve 'self' to the current instance. The path is treated literally instead of being dereferenced.

**Effect**:
- Error: "Attribute 'belasting op basis van afstand' not found on instance of 'Natuurlijk persoon'"
- Rule "Te betalen belasting van een passagier" fails
- Any rule using "zijn/haar" (possessive) references fails

**Specific Failure**:
```python
# Path: ['self', 'belasting op basis van afstand']
# Should resolve to: current_instance.attributes['belasting op basis van afstand']
# Actually does: looks for nested attribute path
```

**Solution**: Update attribute resolution to handle 'self' references:
- In `_handle_attribute_reference` or `evaluate_expression`
- Check if path[0] == 'self', then use current_instance directly
- Remove 'self' from path and continue with remaining elements

---

### 3. Context-Type Path Resolution

**Location**: `src/regelspraak/engine.py` (attribute resolution in evaluate_expression)

**Root Cause**: When a path like `['vlucht', 'verwachte datum-tijd van vertrek']` is evaluated in a Vlucht context, the engine needs to recognize that the first element refers to the current instance type.

**Effect**:
- Error: "Navigation context 'vertrek' does not match current instance type 'Vlucht'"
- Rule "Verwachte datum-tijd van aankomst van een Vlucht" fails
- Attributes with context-type prefixes fail

**Solution**: 
- Check if path[0] matches current instance type (handle singular/plural)
- If match, treat as reference to current instance and use path[1:]
- This is standard Dutch grammar where context is explicitly stated

---

### 4. Cross-Object Aggregation Navigation

**Location**: `src/regelspraak/engine.py:5800-5850` (aggregation functions like _func_maximale_waarde_van)

**Root Cause**: Aggregation functions don't handle navigation to collections before accessing attributes. When evaluating "maximale waarde van de leeftijd van alle passagiers", it tries to find 'leeftijd' on the flight object instead of navigating to passengers first.

**Effect**:
- Error: "'leeftijd' is neither an attribute nor a role name on Vlucht"
- Rule "Leeftijd oudste passagier" fails
- Any aggregation over related objects fails

**Specific Failure**:
```python
# Expression: maximale_waarde_van(leeftijd, passagiers van de reis)
# Current: looks for 'leeftijd' on current instance (Vlucht)
# Should: navigate to passengers first, then get their 'leeftijd' attributes
```

**Solution**:
- In aggregation functions, resolve the collection first
- Then iterate over collection items to access the attribute
- Handle both direct collections and navigated collections

---

### 5. Object Creation Type Resolution

**Location**: 
- `src/regelspraak/builder.py:3961-3988` (visitObjectCreatie)
- `src/regelspraak/engine.py` (object creation handling)

**Root Cause**: The rule "vastgestelde contingent treinmiles" creates an object but uses the full phrase as the type name instead of extracting the actual object type "Contingent treinmiles".

**Effect**:
- Error: "Unknown object type: vastgestelde contingent treinmiles"
- Object creation rules fail
- FeitType relationships can't be established

**Specific Failure**:
```python
# Rule text: "Een vlucht heeft het vastgestelde contingent treinmiles met..."
# Parsed as: object_type = "vastgestelde contingent treinmiles"
# Should be: object_type = "Contingent treinmiles", role = "vastgestelde contingent treinmiles"
```

**Solution**:
- Parse the object creation pattern to extract the actual object type
- Handle article + adjective + noun patterns
- Map to the correct ObjectType definition

---

### 6. Decision Table Cross-Object Navigation

**Location**: `src/regelspraak/engine.py` (decision table evaluation)

**Root Cause**: Decision tables can't navigate across object relationships. When evaluating conditions like "reisduur per trein in minuten van zijn reis", it looks for the attribute on the passenger instead of navigating to the flight.

**Effect**:
- Error: "'reisduur per trein in minuten' is neither a role name nor an attribute on Natuurlijk persoon"
- Beslistabel "Belasting op basis van reisduur" fails
- Cross-object conditions in tables fail

**Specific Failure**:
```python
# Condition: "reisduur per trein in minuten van zijn reis"
# Current context: Natuurlijk persoon (passenger)
# Needs: Navigate to 'reis' (flight), then access 'reisduur per trein'
```

**Solution**:
- Add navigation support in decision table condition evaluation
- Parse "X van zijn/haar Y" patterns in conditions
- Resolve the navigation before checking the condition

---

## Implementation Priority

1. **Fix self-reference resolution** (Critical - blocks basic attribute access)
2. **Fix context-type path resolution** (Critical - blocks many navigation patterns)
3. **Fix aggregation navigation** (High - affects summary calculations)
4. **Fix decision table navigation** (High - affects tax calculations)
5. **Fix object creation** (Medium - affects treinmiles distribution)

## File Changes Required

### src/regelspraak/engine.py
- Line 1524: Add self-reference handling in evaluate_expression (primary)
- Line 5660: Update `_func_het_aantal` for self-references (secondary)
- Lines 5800-5850: Update aggregation functions for navigation
- Lines TBD: Update decision table evaluation for navigation (needs investigation)
- Total changes: ~70 lines

### src/regelspraak/builder.py  
- Lines 3961-3988: Update visitObjectCreatie for proper type extraction
- Total changes: ~15 lines

## Testing Strategy

After implementing each fix, test with:
```bash
cd examples/toka && python run_toka.py simple 2>&1 | grep -E "(Error|Warning)"
```

Expected progression:
1. After fix 1-2: Basic attribute errors resolved
2. After fix 3: Navigation errors resolved  
3. After fix 4: Aggregation errors resolved
4. After fix 5: Object creation works
5. After fix 6: Decision tables work

## Success Criteria

All TOKA rules should execute without errors:
- 0 RuntimeError messages
- 0 "not found" errors
- Successful calculation of taxes and treinmiles distribution