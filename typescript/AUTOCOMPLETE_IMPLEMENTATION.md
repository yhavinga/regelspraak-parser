# Autocomplete Implementation for RegelSpraak TypeScript Parser

## Summary

Implemented `getExpectedTokensAt(text: string, position: number): string[]` method in the TypeScript parser to provide autocomplete suggestions for RegelSpraak code.

## Implementation Approach

After researching ANTLR4's ATN (Augmented Transition Network) and `getExpectedTokens()` API, we discovered that:

1. **ANTLR4's `getExpectedTokens()`** requires an active parsing context (non-null `_ctx`)
2. The context is only available **during** parsing, not after
3. Libraries like `antlr4-c3` provide sophisticated ATN analysis but require complex setup

Therefore, we implemented a **pragmatic context-based solution** that provides useful suggestions without parser complexity.

## Architecture

### Files Created/Modified

1. **`src/parsers/simple-autocomplete.ts`** - Main autocomplete service
   - Context-aware pattern matching
   - Extracts parameter names from document
   - Returns appropriate suggestions based on cursor position

2. **`src/parsers/antlr-parser.ts`** - Added `getExpectedTokensAt()` method
   - Delegates to `SimpleAutocompleteService`
   - Public API for autocomplete functionality

3. **`src/parsers/autocomplete.ts`** - antlr4-c3 based implementation (experimental)
   - Uses CodeCompletionCore for ATN analysis
   - More sophisticated but requires further configuration

### Test Files

1. **`tests/parser-completion.test.ts`** - Basic unit tests
2. **`tests/autocomplete-integration.test.ts`** - Comprehensive integration tests

## Features

The autocomplete provides context-aware suggestions for:

### Top-level definitions (empty document)
- Beslistabel
- Domein
- Feittype
- Objecttype
- Parameter
- Regel
- Regelgroep

### Parameter definitions
- `<naam>` placeholder after "Parameter"
- Data types after colon: Numeriek, Tekst, Bedrag, Datum, Boolean

### Rule definitions
- `<naam>` placeholder after "Regel"
- `geldig` when inside rule body
- `altijd` and `indien` after "geldig"

### Conditions and expressions
- Parameter names after "indien"
- Comparison operators after "is"
- Assignment patterns after "moet"
- Functions and parameters after articles (de/het/een)

## Usage Example

```typescript
import { AntlrParser } from '@regelspraak/parser';

const parser = new AntlrParser();

// Get suggestions at cursor position
const text = 'Parameter loon: ';
const suggestions = parser.getExpectedTokensAt(text, text.length);
// Returns: ['Bedrag', 'Boolean', 'Datum', 'Numeriek', 'Tekst']

// Works with partial rules
const text2 = 'Regel Test\n  geldig ';
const suggestions2 = parser.getExpectedTokensAt(text2, text2.length);
// Returns: ['altijd', 'indien']
```

## Testing

All tests pass:

```bash
npm test -- tests/autocomplete-integration.test.ts
# PASS - 5 tests, all passing
```

## Future Improvements

1. **Full parser-based completion**: Implement proper antlr4-c3 integration
2. **Multi-word token handling**: Better support for RegelSpraak's compound keywords
3. **Symbol-aware completion**: Include defined rules, objects, and domains
4. **Snippet templates**: Provide complete code structures
5. **Type-aware suggestions**: Only show valid options based on data types

## Technical Notes

### Why not use ANTLR's getExpectedTokens()?

ANTLR4's `getExpectedTokens()` method requires:
- Active parsing context (`_ctx` must be non-null)
- Parser to be in mid-parse state
- Complex error recovery to maintain context

The ATN represents the grammar as a state machine, and `getExpectedTokens()` returns valid tokens for the current state. However, after parsing completes (even with errors), the context is cleared.

### antlr4-c3 Alternative

The `antlr4-c3` library provides grammar-agnostic code completion by:
- Analyzing the ATN directly without parsing
- Computing follow sets for any position
- Handling error recovery gracefully

We included a basic implementation in `src/parsers/autocomplete.ts` but it requires additional configuration for production use.

## Conclusion

The implemented solution provides practical, working autocomplete for RegelSpraak that:
- ✅ Works with incomplete/invalid input
- ✅ Provides context-aware suggestions
- ✅ Extracts symbols from the document
- ✅ Has comprehensive test coverage
- ✅ Ships today with immediate value

This follows Carmack's principle: ship the simplest thing that works, then iterate based on usage.