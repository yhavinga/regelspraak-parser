# Test Fixes TODO

## FIXED Issues ✅

### 1. TypeScript Configuration Issues - FIXED ✅
- Added `"jest"` to tsconfig.json types array
- Added missing Jest imports to all test files
- All TypeScript files now compile successfully

### 2. Code Actions Test Infrastructure - MOSTLY FIXED ✅
- Fixed request/notification distinction (sendRequest vs sendNotification)
- Fixed message parsing with proper Buffer handling
- 4 out of 6 tests passing

## Remaining Test Issues

### 1. Code Actions - 2 Minor Failures
- "should offer to replace 'Rule' with 'Regel'" - Can't find action with that title
- "should fix common Parameter misspellings" - Looking for wrong title

**Root cause**: Test expects specific action titles that server doesn't provide

**Fix**: Check actual titles returned by server and update tests

### 2. Other Test Timeouts (4 test files)
These tests still timeout due to improper message handling:
- `test/goto-definition.test.ts` - 1 test timeout
- `test/references.test.ts` - 1 test timeout  
- `test/document-symbols.test.ts` - 2 tests timeout
- `test/semantic-tokens.test.ts` - 2 tests timeout

**Root cause**: These tests use old-style message handling without proper request/notification distinction

**Fix**: Apply same fixes as code-actions.test.ts (proper sendRequest/sendNotification)

### 3. Format Rules - Grammar Complexity
Currently skipped in test. The formatter works for parameters but struggles with rules due to:
- Complex rule body syntax variations
- Parser doesn't accept all valid rule patterns
- Need to understand exact grammar for rule bodies

**Fix**: Study grammar to understand valid rule body patterns, update formatter accordingly

### 4. JavaScript Test Files Need TypeScript Conversion
20+ JavaScript test/debug files that should be TypeScript:
- All `test-*.js` files (test-minus.js, test-references.js, test-code-action.js, test-format-rules.js, etc.)
- All `debug-*.js` files in test directory
- Helper scripts

**Fix**: Convert to TypeScript with proper types

### 5. Test Infrastructure Cleanup
- Remove temporary debug scripts
- Consolidate test helpers
- Fix process cleanup (worker process force exit warnings)
- Add proper teardown to prevent leaking timers

**Fix**: Refactor test infrastructure for cleaner setup/teardown

## Priority Order

1. **Fix TypeScript configuration** (would fix 5 test suites immediately)
2. **Debug code-actions.test.ts timeout issue** (would fix 6 more tests)
3. **Convert JS test files to TS** (code quality improvement)
4. **Understand rule grammar for proper formatting** (complete Format Document feature)
5. **Clean up test infrastructure** (prevent warnings and improve reliability)

## Current Status
- **Tests passing**: 40/48 (83%)
- **Test suites passing**: 2/7
- **Main issues**: Test infrastructure for older test files needs same fixes as code-actions.test.ts

## Notes
- Root cause analysis revealed many test failures were due to invalid RegelSpraak syntax in tests
- Specification should always be leading - tests can be wrong
- Focus on fixing root causes, not workarounds