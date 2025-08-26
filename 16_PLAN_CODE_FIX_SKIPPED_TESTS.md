# PLAN: Fix All Remaining Skipped Tests

**Date: 2025-08-26**  
**Goal**: Achieve 100% test completion by fixing all legitimate skipped tests  
**Initial State**: Python: 487 tests, 9 skipped | TypeScript: 454 tests, 17 skipped
**Current State**: Python: 487 tests, 6 skipped (✅ Fixed 3) | TypeScript: 454 tests, 17 skipped

## Analysis of Remaining 9 Skipped Python Tests

### 1. Rule Targeting with Feittype Context ✅ ALREADY WORKING
- **Test**: `test_feittype_basic.py::test_feittype_with_rule`
- **Issue**: Incorrectly assumed broken - KenmerkToekenning with feittype context actually works
- **Evidence**: `test_subselectie.py` has 4 passing tests using KenmerkToekenning with feittype relationships:
  - `test_kenmerk_filtering` - assigns minderjarig kenmerk to passengers via feittype
  - `test_kenmerk_with_aggregation` - combines kenmerken with som van 
  - `test_multiple_subselectie` - senior kenmerk assignment
  - `test_navigation_through_feittype` - minderjarig kenmerk with complex navigation
- **Root Cause**: Test was placeholder with incorrect assumption since commit e847f29 (2025-06-22)
- **Fix**: Remove skip and implement proper test OR delete as redundant (already covered)

### 2. Nested Object-Type Attributes ✅ FIXED (2025-08-26)
- **Test**: `test_feittype_complete.py::test_nested_object_reference_traversal`
- **Issue**: Grammar doesn't allow object types as attribute datatypes (e.g., `het woonadres Adres`)
- **Root Cause**: Grammar limitation in `attributeDef` rule
- **Fix**: Extended grammar to accept object type names as valid datatypes
- **Solution**: Added `objectTypeRef` rule, updated `attribuutSpecificatie` to accept it
- **Result**: `test_runtime_object_reference_storage` now passes

### 3. Percentage Datatype Syntax ✅ FIXED (2025-08-26)
- **Test**: `test_object_creation_integration.py::test_object_creation_with_expression`
- **Issue**: Parser fails on `Percentage` as datatype and percentage literals like `21%`
- **Root Cause**: Grammar missing Percentage datatype support
- **Fix**: Added percentageDatatype rule, enabled parameter initialization syntax
- **Solution**: Implemented percentage literal conversion (21% → 0.21) and 'van' operator
- **Result**: Test now passes with proper percentage calculations

### 4. Parameter Datatype Syntax  
- **Test**: `test_object_creation_integration.py::test_conditional_object_creation`
- **Issue**: Using parameters in object creation expressions fails
- **Root Cause**: Grammar/parser issue with parameter references in certain contexts
- **Fix**: Ensure parameter references work in all expression contexts

### 5. Nested Path Semantic Analysis
- **Test**: `test_path_construction.py::test_deeply_nested_path_construction`
- **Issue**: Semantic analyzer doesn't validate deeply nested paths
- **Root Cause**: Not implemented in semantic analyzer
- **Fix**: Add nested path validation to `semantics.py`

### 6. Duplicate Parameter Detection
- **Test**: `test_semantics.py::test_duplicate_parameter_definition`  
- **Issue**: Parser merges duplicates instead of erroring
- **Root Cause**: Builder uses dictionary, overwrites duplicates silently
- **Fix**: Track parameter names during parsing, error on duplicates

### 7. Timeline-Dimension Integration
- **Test**: `test_timeline.py::test_timeline_with_dimensions`
- **Issue**: Dimension syntax with timelines needs verification
- **Root Cause**: Unclear if current syntax matches specification
- **Fix**: Verify against spec section on Dimensions, fix any discrepancies

### 8-9. REPL Tests (Keep Skipped)
- **Tests**: `test_repl.py::test_basic_repl`, `test_repl.py::test_steelthread_example`
- **Issue**: Require TTY environment
- **Resolution**: Keep skipped - these are environment-specific

## Implementation Priority

### Phase 1: Grammar Fixes (High Impact)
1. **Add Percentage datatype**
   - Add PERCENTAGE lexer token: `PERCENTAGE : NUMERIEK '%'`
   - Update datatype rule to include Percentage
   - Update builder to handle percentage literals

2. **Enable object types as attribute datatypes**
   - Modify `attributeDef` to accept `naamwoord` as datatype
   - Update semantic analyzer to mark object references
   - Ensure navigation works with object attributes

3. **Fix parameter references in expressions**
   - Review all expression contexts in grammar
   - Ensure parameter references are valid everywhere
   - Test with object creation scenarios

### Phase 2: Semantic Analysis
4. **Implement nested path validation**
   - Add depth checking for navigation paths
   - Validate each hop in the path exists
   - Provide clear error messages

5. **Add duplicate parameter detection**
   - Track parameter names during building
   - Error if same name defined twice
   - Don't silently merge/overwrite

### Phase 3: Runtime/Test Fixes
6. **Remove incorrect skip for test_feittype_with_rule** ✅ NO CODE FIX NEEDED
   - Either implement the test properly (though redundant)
   - Or remove as duplicate of existing coverage in test_subselectie.py
   - KenmerkToekenning with feittype already works correctly

7. **Verify dimension syntax**
   - Check specification section 8 (Dimensions)
   - Compare with current implementation
   - Fix any discrepancies

## Expected Outcome

After all fixes:
- **Python**: 486 tests passing, 2 skipped (REPL only) 
  - 1 test can be unskipped immediately (test_feittype_with_rule)
  - 6 tests require grammar/semantic fixes
- **TypeScript**: Apply same fixes, similar improvement
- **Achievement**: True 100% specification compliance

## Implementation Approach

Following John Carmack's philosophy:
- Fix root causes in grammar/parser, not symptoms
- Each fix should be minimal and surgical
- Test against specification examples
- No workarounds or hacks
- Use tools when needed:
  - GPT-5 for complex parser bugs: `cursor-agent -p "@grammar/RegelSpraak.g4 @src/regelspraak/builder.py Fix percentage datatype parsing"`
  - Gemini for spec verification: `gemini -p "@specification/ @grammar/ Does Percentage datatype match spec?"`

## Success Criteria

- All non-environment-specific tests pass
- No legitimate specification features are skipped
- Grammar correctly implements all spec datatypes
- Semantic analysis catches all specified errors
- Runtime handles all specified rule patterns

## Progress Update (2025-08-26)

### KenmerkToekenning Investigation Complete ✅
- **Discovery**: KenmerkToekenning with feittype relationships was already working correctly
- **Evidence**: Found 4 passing tests in `test_subselectie.py` that prove the functionality
- **Action Taken**: Implemented proper test for `test_feittype_basic.py::test_feittype_with_rule` 
- **Result**: Test now passes - reduced skipped count from 9 to 8
- **Conclusion**: No engine or parser changes needed for this issue