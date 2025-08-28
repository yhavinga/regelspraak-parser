# TOKA Engine Support Status - 2025-08-28

## Summary
The RegelSpraak parser now achieves **100% syntactic parsing** of the TOKA specification. All 26 rules and 2 decision tables parse successfully. However, several engine execution issues remain.

## ✅ Parser Success (100% Complete)
- All TOKA files parse without syntax errors
- Complex parameter names supported: "de korting bij gebruik niet-fossiele brandstof"
- Rule names with numbers/prepositions work: "Passagier van 18 tm 24 jaar"
- Beslistabel with 'of' syntax parses correctly
- Combined begrenzing and afronding expressions parse
- Consistency checks with "moet ongelijk zijn aan" parse

## ❌ Engine Limitations Found

### 1. DisjunctionExpression Evaluation
**Error**: `'DisjunctionExpression' object has no attribute 'value'`
- **Context**: Decision tables with 'of' operator in conditions
- **Example**: `'Friesland', 'Groningen', 'Drenthe' of 'Limburg'`
- **Impact**: Beslistabel execution fails

### 2. Literal Values as Parameters
**Error**: `Parameter '18 jr' not found in runtime context`
- **Context**: Rules comparing attributes to literal values
- **Example**: `zijn leeftijd is groter of gelijk aan 18 jr`
- **Impact**: Age range rules fail to execute

### 3. Unit Handling in Expressions
**Error**: `Cannot subtract values with incompatible units: 'None' and '€'`
- **Context**: Arithmetic with units
- **Example**: `de waarde van de test min 100 €`
- **Impact**: Tax calculations with currency fail

### 4. Rule Name Parsing Inconsistency
**Issue**: Some rule names lose words during parsing
- **Example**: "verdeling treinmiles in gelijke delen" becomes "verdeling treinmiles"
- **Impact**: Specific distribution rules can't be found

### 5. Attribute Name Normalization
**Issue**: Spaces in attribute names get converted to underscores
- **Example**: "te betalen belasting" becomes "te_betalen_belasting"
- **Impact**: Tests need to use normalized names

## Test Results Summary

### Original TOKA Tests
- `test_toka_beslistabel_of.py`: ❌ Fails (DisjunctionExpression issue)
- `test_toka_eerste_paasdag.py`: ❌ Fails (function not returning correct result)
- `test_toka_kenmerk_complex.py`: ❌ Fails (literal value parameter issue)
- `test_toka_natuurlijk_persoon.py`: ✅ Parses correctly

### Integration Tests
- Parse complete files: ✅ Works (with rule name issue)
- Parameter references: ❌ Fails (unit handling)
- Begrenzing/afronding: ❌ Fails (unit handling)
- Consistency checks: ✅ Works
- Decision tables: ❌ Fails (DisjunctionExpression)
- Distribution rules: ⚠️ Partial (rule name issue)
- Easter calculation: ❌ Fails (function issue)
- Object creation: ✅ Works
- Age calculation: ❌ Fails (relationship API issue)

## Root Causes

1. **DisjunctionExpression**: Engine doesn't know how to evaluate 'of' expressions
2. **Literal Comparisons**: Engine treats literal values as parameter references
3. **Unit Arithmetic**: Engine doesn't properly handle units in arithmetic operations
4. **Function Registry**: Some date functions may not be implemented correctly
5. **API Mismatches**: Test code uses wrong runtime API methods

## Recommended Next Steps

1. **Fix DisjunctionExpression evaluation** in engine.py
   - Add proper handling for expressions with 'of' operator
   - Should evaluate to true if any sub-expression matches

2. **Fix literal value handling** in comparisons
   - Don't treat literal values as parameter references
   - Properly parse units in literal expressions

3. **Fix unit arithmetic**
   - Ensure units are preserved in arithmetic operations
   - Handle currency units correctly

4. **Fix rule name parsing**
   - Preserve complete rule names including prepositions
   - "in gelijke delen" should not be dropped

5. **Document API correctly**
   - Clarify when to use underscores vs spaces
   - Document proper relationship creation methods

## Conclusion

The parser successfully handles 100% of TOKA syntax, but the engine needs several fixes to fully execute TOKA rules. The main issues are:
- DisjunctionExpression evaluation
- Literal value handling in comparisons
- Unit arithmetic
- Rule name preservation

These are fixable issues in the engine implementation, not fundamental limitations of the RegelSpraak design.