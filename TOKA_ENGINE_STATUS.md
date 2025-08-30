# TOKA Engine Support Status - 2025-08-30 - IN PROGRESS 🔧

## Summary
**TOKA has critical issues discovered in runtime execution**

- **Parser**: 100% syntactic parsing of all 25 rules + 2 decision tables ✅
- **Engine**: Critical FeitType parsing bug discovered - object types include cardinality text ❌
- **Tests**: Runtime execution failing due to navigation and type deduction issues
- **Specification Compliance**: Parser matches spec, but runtime has issues

## ✅ Parser Success (100% Complete)
- All TOKA files parse without syntax errors
- Complex parameter names supported: "de korting bij gebruik niet-fossiele brandstof" ✅ FIXED
- Rule names with numbers/prepositions work: "Passagier van 18 tm 24 jaar"
- Beslistabel with 'of' syntax parses correctly
- Combined begrenzing and afronding expressions parse
- Consistency checks with "moet ongelijk zijn aan" parse
- Time units properly recognized (minuten, jaren, etc.) ✅ FIXED

## ✅ Engine Issues Resolved

### 1. ~~DisjunctionExpression Evaluation~~ ✅ FIXED
- Added proper handling in engine._handle_binary()
- 'of' operator now correctly evaluates disjunctions
- Decision tables with multiple options work

### 2. ~~Literal Values as Parameters~~ ✅ FIXED
- Grammar reordered to prioritize NUMBER literals
- Literal values like "18 jr" now parse correctly
- Age range rules execute properly

### 3. ~~Unit Handling in Expressions~~ ✅ FIXED
- Unit compatibility check now allows None units
- Arithmetic operations preserve units correctly
- Currency calculations work

### 4. ~~Complex Parameter Names~~ ✅ FIXED
- Parameters with prepositions now correctly recognized
- Full text reconstruction from input stream preserves spaces
- "korting bij gebruik niet-fossiele brandstof" works

### 5. ~~DateCalcExpr Grammar Ambiguity~~ ✅ FIXED
- Restricted DateCalcExpr to specific time units only
- Prevents misparse of "X min Y brandstof" as date arithmetic
- Regular subtraction with "min" operator works correctly

### 6. ~~Rule Name Parsing Inconsistency~~ ✅ FIXED
- Rule names now preserve all parts including extensions like "in gelijke delen"
- Fixed by updating `_extract_canonical_name` method in builder.py

### 7. ~~Relationship Navigation in Expressions~~ ✅ FIXED
- Engine can now traverse FeitType relationships in attribute references
- Example: `"de vluchtdatum van zijn reis"` now works - navigates from Natuurlijk persoon → Vlucht → vluchtdatum
- Fixed two issues:
  - FeitType parsing no longer includes cardinality descriptions as roles
  - Navigation properly breaks after successful role match (was continuing to check other FeitTypes)

### 8. ~~Unit Mismatch in tijdsduur~~ ✅ FIXED (2025-08-29)
- tijdsduur function now returns canonical "jr" unit instead of "jaren"
- All age comparison rules now work correctly

### 9. ~~'Vlucht is duurzaam' Rule~~ ✅ FIXED (2025-08-29)
- Fixed self-reference issue by using "hij" instead of "de vlucht"
- Rule now executes correctly to determine sustainable flights

## ✅ All Major Engine Issues Resolved

### BegrenzingAfrondingExpression ✅ ALREADY IMPLEMENTED
- Combined begrenzing + afronding operations fully working
- Correctly applies minimum/maximum bounds before rounding
- All rounding directions supported (naar_beneden, naar_boven, etc.)
- TOKA "Te betalen belasting" rule uses this successfully

## Test Results Summary

### Parser Tests (After Fixes)
- `test_toka_beslistabel_of.py`: ✅ FIXED (DisjunctionExpression handled)
- `test_toka_eerste_paasdag.py`: ⚠️ Function implementation issue remains
- `test_toka_kenmerk_complex.py`: ✅ FIXED (literal values parse correctly)
- `test_toka_natuurlijk_persoon.py`: ✅ Works

### Integration Tests (After Fixes)
- Parse complete files: ✅ Works
- Parameter references: ✅ FIXED (complex names with prepositions)
- Begrenzing/afronding: ✅ FIXED (unit handling)
- Consistency checks: ✅ Works
- Decision tables: ✅ FIXED (DisjunctionExpression)
- Distribution rules: ✅ FIXED (rule names now preserved correctly)
- Easter calculation: ⚠️ Function implementation issue
- Object creation: ✅ Works
- Age calculation: ✅ FIXED (relationship navigation now works)

## Minor Remaining Issues

1. **Easter Function**: Implementation may need adjustment
   - Affects eerste paasdag calculation only
   - Non-critical for TOKA core functionality
   - Only affects Easter discount rule

## Recommended Next Steps

1. **Fix Easter Function** 
   - Verify eerste paasdag calculation implementation
   - May need calendar library or algorithm adjustment
   - This is the only remaining implementation issue

2. **Complete Integration Testing**
   - Run full TOKA scenarios
   - Verify all 26 rules execute correctly end-to-end
   - Confirm both decision tables work properly

## CRITICAL ISSUES RESOLVED (2025-08-30)

### 10. ~~FeitType Parsing Bug~~ ✅ FIXED
- **Problem**: Object types in FeitType roles included cardinality text
- **Example**: "Natuurlijk persoon één reis betreft" instead of "Natuurlijk persoon"
- **Root Cause**: Grammar `rolContentWords` was too greedy, tabs were on HIDDEN channel
- **Solution**: Modified builder.py to detect tabs in raw input stream
- **Implementation**: 
  ```python
  # Access raw input including HIDDEN channel
  input_stream = ctx.start.getInputStream()
  full_text = input_stream.getText(start_idx, stop_idx)
  if '\t' in full_text:
      parts = full_text.split('\t', 1)  # Split on tab
  ```
- **Impact**: FeitTypes now parse correctly with proper role/object type separation

### 11. ~~RuntimeObject Initialization~~ ✅ FIXED (2025-08-30)
- **Problem**: Instances created without all attributes defined
- **Solution**: Added `create_object` method to RuntimeContext
- **Impact**: Fixed "Attribute not found" errors

### 12. ~~Parameter Semicolons~~ ✅ FIXED (2025-08-30)
- **Problem**: Grammar required semicolons, spec doesn't
- **Solution**: Removed SEMICOLON from parameterDefinition rule
- **Impact**: TOKA parameters now parse correctly

### 13. ~~Tab Delimiters Added~~ ✅ FIXED (2025-08-30)
- **Problem**: EBNF specification requires tabs as structural delimiters
- **Analysis**: Tabs disambiguate complex attribute names from datatypes
- **Implementation**:
  - Added tabs to attributes: `de belasting op basis van afstand[TAB]Bedrag`
  - Added tabs to enumerations: `[TAB]'Amsterdam Schiphol'`
  - Added tabs to variables: `[TAB]A is ...`
  - FeitTypes already had correct tabs
- **Parser approach**: Keep tabs on HIDDEN channel, use as disambiguation hints in builder
- **Impact**: Improved parsing accuracy for complex attribute names

## Current Status (Updated 2025-08-30)

**TOKA PARSING: 100% COMPLETE** ✅
**TOKA RUNTIME: PARTIALLY WORKING** ⚠️

### Working:
- All 25 rules + 2 decision tables parse correctly
- FeitType definitions parse with correct role/object type separation
- Parameters with complex names work
- RuntimeObject initialization complete with all attributes
- Tabs properly added to TOKA files per EBNF specification requirements

### Still Failing:
1. **Target type deduction**: Rules like "belasting op basis van afstand" can't determine target type
2. **Cross-object navigation in decision tables**: "reisduur per trein in minuten" on Natuurlijk persoon fails
3. **Object creation with compound names**: "vastgestelde contingent treinmiles" type resolution
4. **Aggregation navigation**: "passagiers van de reis" in aggregation context

## Next Steps

1. **Fix Target Type Deduction** (CRITICAL)
   - Investigate why rules can't determine their target object type
   - May need to improve subject/object resolution in rule headers
   - Check if "voor alle X" patterns are properly parsed
   - Note: Tab delimiters now help disambiguate, but type deduction logic still needs work

2. **Fix Cross-Object Navigation**
   - Decision tables need to navigate from current object to related objects
   - Example: From Natuurlijk persoon → Vlucht → attributes
   - May need context-aware navigation in beslistabel evaluation

3. **Fix Object Creation Type Resolution**
   - "vastgestelde contingent treinmiles" should resolve to "Contingent treinmiles"
   - Likely needs compound name handling in object creation

4. **Test Full Execution**
   - After fixes, verify all calculations work
   - Aim for 100% validation pass rate

## Session Notes (2025-08-30)

### Key Discoveries:
1. **EBNF Specification Tabs**: The `\t` and `\n` in spec are semantic requirements, not PDF artifacts
2. **Tab Usage**: Tabs provide clear structural delimiters for attributes, enumerations, variables
3. **Parser Strategy**: Keep tabs on HIDDEN channel, use as hints in builder (not structural tokens)
4. **Impact**: Tabs help disambiguate complex multi-word attribute names from their datatypes

### Technical Implementation:
- Modified `fix_tabs.py` script to add tabs systematically
- Updated both `gegevens.rs` and `regels.rs` with proper tab placement
- Kept grammar flexible (accepts spaces or tabs) for pragmatic parsing
- FeitType tab detection already working correctly via raw input stream access

**Current Achievement**: Parser complete, FeitTypes fixed, runtime ~60% functional. Main issues are type deduction and cross-object navigation.