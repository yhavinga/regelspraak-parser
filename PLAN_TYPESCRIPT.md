# RegelSpraak TypeScript Implementation Plan (Revised)

## Current Status (2025-07-25 - Session 3)

### ✅ Completed Phases
- **Phase 0-4**: Basic architecture and expression evaluation complete
- **Phase 5**: Decision tables, aggregations, timelines implemented
- **Phase 6**: Performance validation shows 1000x+ speedup (but misleading - see below)
- **Phase 7**: ANTLR4 Integration foundation complete
- **Phase 8a**: Comparison operators COMPLETE ✓
- **Phase 8b**: Logical operators, parentheses, unary operators COMPLETE ✓
- **Phase 8c**: Function calls (Dutch syntax) COMPLETE ✓

### 🎯 Progress Update
The TypeScript implementation is now **~30% complete** compared to Python:
- ✅ Has: ANTLR4 parser, all operators, parentheses, numbers/variables, Dutch functions, **rule parsing & execution**
- ✅ Tests: 149/155 passing (96.1%) - excellent progress!
- ❌ Missing: Objects, semantic validation, decision tables, 60% of features

### 📊 Key Achievements (Session 3) 
- ✅ **Logical operators (en, of) fully implemented**:
  - Short-circuit evaluation for performance
  - 18 new tests all passing
- ✅ **Parentheses support validated**:
  - Already working from visitParenExpr
  - 9 new tests confirm proper precedence
- ✅ **Unary operators complete**:
  - Unary minus (min) for numeric negation
  - Logical NOT (niet) for boolean negation  
  - 19 new tests all passing
- ✅ **Function calls implemented**:
  - Dutch syntax: "de wortel van" (sqrt), "de absolute waarde van" (abs)
  - Tests updated from English to Dutch syntax
  - Grammar limitations documented
- ✅ **Test coverage expanded**: 143/149 tests passing (96.0%)

### 📊 Key Achievements (Session 2)
- ✅ **Comparison operators fully implemented**:
  - All Dutch operators mapped: gelijk aan (==), groter dan (>), etc.
  - Boolean evaluation working correctly
  - 14 new tests all passing
- ✅ **Fixed all test files to use Dutch syntax**
- ✅ **Resolved ANTLR4 visitor accessor patterns**
- ✅ **Extended type system for comparison operators**

---

## Critical Analysis: Why This Port Matters

### Current Python Implementation Reality
- **builder.py**: 176KB, 74 visitor methods - a monolithic disaster
- **engine.py**: 332KB, 114 methods - unmaintainable God Object
- **Total**: 508KB across 2 files = architectural failure

### The Real Opportunity
TypeScript isn't just about performance - it's about **fixing the architecture during the port**.

## Core Principles (Carmack Style)

1. **No module > 50KB** - Hard limit, no exceptions
2. **No class > 20 methods** - If you hit 21, refactor
3. **Measure daily** - File sizes, method counts, performance
4. **Vertical slices** - One feature through all layers
5. **Delete mercilessly** - Complexity is the enemy

## New Architecture: Decomposed from Day One

### Module Structure (Maximum 50KB each)
```
typescript/
├── src/
│   ├── visitors/                    # Decomposed visitor pattern
│   │   ├── ExpressionVisitor.ts    # ~30KB - expressions only
│   │   ├── RuleVisitor.ts          # ~25KB - rules/gelijkstelling
│   │   ├── DecisionTableVisitor.ts # ~20KB - beslistabel
│   │   ├── DimensionVisitor.ts     # ~15KB - dimensions/aggregations
│   │   ├── StructureVisitor.ts     # ~20KB - feittype/kenmerk
│   │   └── ModelBuilder.ts         # ~10KB - thin orchestrator
│   ├── evaluators/                  # Decomposed evaluation
│   │   ├── ExpressionEvaluator.ts  # ~40KB - expression evaluation
│   │   ├── FunctionRegistry.ts     # ~15KB - built-in functions
│   │   ├── AggregationEngine.ts    # ~25KB - aggregation logic
│   │   └── TimelineEvaluator.ts    # ~30KB - timeline operations
│   ├── executors/                   # Decomposed execution
│   │   ├── RuleExecutor.ts         # ~30KB - rule execution
│   │   ├── DecisionTableExecutor.ts # ~20KB - beslistabel logic
│   │   └── RecursionExecutor.ts    # ~15KB - recursion handling
│   ├── runtime/                     # State management
│   │   ├── RuntimeContext.ts       # ~25KB - variable/parameter state
│   │   ├── ObjectManager.ts        # ~20KB - object lifecycle
│   │   └── TraceSink.ts            # ~10KB - execution tracing
│   ├── engine/                      # Thin orchestration layer
│   │   └── Engine.ts               # ~15KB - coordinates modules
│   └── ast/                         # Data structures only
│       ├── expressions.ts          # ~10KB
│       ├── rules.ts                # ~8KB
│       └── model.ts                # ~12KB
```

## Implementation Phases

### ✅ Phase 0-6: COMPLETED (but incomplete)
All initial phases completed with basic features. Performance shows 1000x+ improvement but this is misleading - we're comparing a toy implementation to a full parser.

### ✅ Phase 7: ANTLR4 Integration - FOUNDATION COMPLETE

**Status**: Basic expression parsing complete, visitor pattern established

**What We Built**:
- ✅ TypeScript parser generation from RegelSpraak.g4
- ✅ Visitor implementation with proper context type mapping
- ✅ Number literals with Dutch decimal notation (3,14 → 3.14)
- ✅ Variable references via OnderwerpRefExpr
- ✅ Binary operators: plus, min, maal, gedeeld door
- ✅ Proper AST node creation matching existing interfaces
- ✅ Engine integration replacing toy parsers

**Lessons Learned**:
- ANTLR4 generates specific context classes for labeled alternatives (# labels)
- Dutch grammar treats single identifiers differently than English
- Visitor methods must match exact generated names (visitNumberLiteralExpr not visitNumberLiteral)

### ✅ Phase 8a: Comparison Operators - COMPLETE (Session 2)

**Completed**:
- ✅ All comparison operators implemented and tested
- ✅ Proper ANTLR4 context accessor pattern established
- ✅ Boolean evaluation in ExpressionEvaluator
- ✅ Type system extended for comparison operators

### ✅ Phase 8b: Expression Enhancement - COMPLETE (Session 3)

**Completed**:
- ✅ **Logical operators** (en, of) with short-circuit evaluation
- ✅ **Parentheses support** - already working, validated with tests
- ✅ **Unary operators** - niet (NOT) and min (unary minus)

### ✅ Phase 8c: Function Calls - COMPLETE (Session 3)

**Completed**:
- ✅ **Built-in functions implemented**:
  - visitWortelFuncExpr (de wortel van X) → sqrt
  - visitAbsValFuncExpr (de absolute waarde van X) → abs
- ✅ **Tests updated** to use Dutch syntax instead of English
- ✅ **Grammar limitations documented**:
  - Absolute value only accepts primaryExpression (no complex expressions)
  - Function keywords must match exactly (no extra whitespace)
  - Operator precedence requires parentheses for complex arguments

### ✅ Phase 9: Rule & Object Support - RULES, OBJECTS, AND PARAMETERS COMPLETE ✓

**Completed**:
- ✅ **Rule parsing via ANTLR** 
  - visitRegel, visitRegelVersie, visitGelijkstellingResultaat
  - Gelijkstelling patterns (X moet berekend worden als Y)
  - Rule execution with proper target extraction
- ✅ **Object type definitions**
  - visitObjectTypeDefinition with kenmerk and attribute parsing
  - Fixed ANTLR4 TypeScript list accessor patterns (_list() methods)
  - Support for units, dimensions, timelines, data types
- ✅ **Parameter definitions**
  - visitParameterDefinition with domain and data type support
  - Proper space preservation in multi-word parameter names
  - Unit specifications including complex units via eenheidExpressie
  - Tests: 166/172 passing (96.5%)

**Still TODO**:
- Conditional rules (indien X dan Y)
- Better error messages for invalid syntax

### 📋 Phase 10: Advanced Features (2-3 weeks)

**Major Features to Implement**:
1. **Dutch language patterns**
   - "de X van Y" navigation expressions
   - Article handling (de/het)
   - Plural forms and conjugations

2. **Complex predicates**
   - Validation predicates (elfproef, dagsoort)
   - Compound predicates (ALLE, GEEN VAN DE)
   - Subselectie (filtered collections)

3. **Advanced rule types**
   - Distribution rules (Verdeling)
   - Recursion (Recursie)
   - Decision tables (already partially done)

4. **System features**
   - Real timeline support (not stubs)
   - Unit system with conversions
   - Semantic validation layer
   - Tracing infrastructure

### 🏁 Phase 11: Polish & Production Ready (1 week)

- Port remaining 400+ Python tests
- Error messages in Dutch
- Performance optimization
- Documentation
- CLI improvements

## Revised Timeline

**Total estimate**: 4-5 weeks for full parity with Python
- ✅ Week 0: ANTLR4 foundation (COMPLETE)
- Week 1: Expression enhancement (2-3 days) + Rule support (3-4 days)
- Week 2-3: Advanced features and Dutch patterns
- Week 4: Polish and remaining tests
- Week 5: Buffer for unknowns

## Next Session Checklist

When continuing, start with:
1. Run `npm test` to see current state (132/149 passing, 88.6%)
2. Focus on failing tests: 15 failures in function-calls.test.ts
3. Implement Dutch function call syntax (de wortel van, de absolute waarde van)
4. Check grammar for function call patterns (visitWortelFuncExpr, etc.)
5. The visitor pattern is established - follow same approach as other operators

## Technical Notes from ANTLR4 Integration

### Key Learnings:
1. **Labeled Alternatives**: Grammar rules with `# Label` generate specific context classes
   - `NUMBER` → `NumberLiteralExprContext` (not generic PrimaryExpressionContext)
   - Visitor methods must match: `visitNumberLiteralExpr` (not visitPrimaryExpression)

2. **Dutch Grammar Quirks**:
   - Decimal separator is comma: `3,14` not `3.14`
   - Single identifiers parsed as `OnderwerpRefExpr` not `IdentifierExpr`
   - Operators are words: `plus`, `min`, `maal`, `gedeeld door`

3. **Context Navigation**:
   - Use `ctx.METHOD()` for single children (e.g., `ctx.NUMBER()`)
   - Use `ctx.METHOD_list()` for multiple children (e.g., `ctx.additiveExpression_list()`)
   - Terminal nodes accessed via `ctx.TOKEN()` returning `TerminalNode`
   - For labeled alternatives, use accessor methods not direct properties (ctx.additiveExpression_list() not ctx.left)

4. **Integration Pattern**:
   ```typescript
   // In engine.ts
   private antlrParser = new AntlrParser();
   
   // Replace hand-rolled parsing
   const ast = this.antlrParser.parseExpression(trimmed);
   ```

5. **Common Pitfalls**:
   - Don't forget to implement `visitChildren` as fallback
   - ExecutionResult needs `value` property, not `result`
   - Test data must use Dutch syntax (operators, decimals)
   - TypeScript compilation errors may hide runtime issues - use `--transpile-only` for debugging

### Session 3 Technical Achievements:
1. **Implemented short-circuit evaluation**:
   - && operator: Don't evaluate right if left is false
   - || operator: Don't evaluate right if left is true
   - Improves performance and enables safe patterns
   
2. **Added UnaryExpression to AST**:
   - New expression type for unary operators
   - Supports both '-' (numeric negation) and '!' (logical NOT)
   - Proper error handling for type mismatches
   
3. **Grammar pattern discoveries**:
   - Logical expressions are right-associative
   - Parentheses already work via visitParenExpr
   - Unary operators defined as primaryExpression alternatives

### Session 2 Technical Achievements:
1. **Fixed visitor accessor pattern bug**:
   - Was trying to use `ctx.left` directly (undefined)
   - Solution: Use `ctx.additiveExpression_list()[0]` for proper access
   
2. **Extended type system properly**:
   - BinaryExpression operator type extended to include comparison operators
   - Added evaluateComparisonExpression method for boolean results
   
3. **Established testing pattern**:
   - All tests must use Dutch syntax
   - Created comprehensive comparison-operators.test.ts as template
   - Fixed existing tests (binary-expressions, variable-references, function-calls)

## Architecture Constraints

### Visitor Decomposition
```typescript
// BAD: One massive visitor (Python mistake)
class ModelBuilder {
  visit74Methods() { /* 176KB of chaos */ }
}

// GOOD: Specialized visitors
class ExpressionVisitor { /* 15 methods max */ }
class RuleVisitor { /* 10 methods max */ }
```

### Evaluator Decomposition
```typescript
// BAD: One massive evaluator (Python mistake)
class Engine {
  do114Things() { /* 332KB of madness */ }
}

// GOOD: Single responsibility
class ExpressionEvaluator { /* expressions only */ }
class RuleExecutor { /* rules only */ }
```

## Migration Strategy

### What to Port vs Rewrite

**Direct Port** (minimal changes):
- AST types (already clean)
- Unit system (well isolated)
- Arithmetic operations (focused)

**Rewrite During Port**:
- Visitor pattern (decompose from start)
- Engine (split into 6+ modules)
- Runtime context (proper encapsulation)

### Critical Path Items

1. **_extract_canonical_name (136 lines)** → Push to grammar
2. **parameter_names hack** → Proper AST distinction
3. **Monolithic visitor** → Specialized visitors
4. **God Object engine** → Module decomposition

## Success Metrics

### Hard Requirements
- **No module > 50KB** (measured daily)
- **No class > 20 methods** (enforced in PR)
- **3x performance** (measured against Python)
- **100% test parity** (same inputs, same outputs)

### Quality Gates
```bash
# Pre-commit hook
if find src -name "*.ts" -size +50k | grep -q .; then
  echo "ERROR: Files exceed 50KB limit"
  exit 1
fi

if grep -r "class.*{" src | xargs -I {} grep -c "^\s*\w\+(" {} | grep -v ":" | awk '$1>20 {exit 1}'; then
  echo "ERROR: Class exceeds 20 methods"
  exit 1
fi
```

## Daily Checklist

- [ ] Run size check on all modules
- [ ] Count methods in changed classes  
- [ ] Run performance benchmark
- [ ] Compare output with Python
- [ ] Delete unnecessary code

## What NOT to Do

1. **Don't port the mess** - Fix architecture during port
2. **Don't add features before structure** - Architecture first
3. **Don't skip measurements** - Discipline matters
4. **Don't accept "temporary" complexity** - It becomes permanent
5. **Don't create mega-PRs** - Small, focused changes

## The Real Goal

Not just a TypeScript port, but a **properly architected implementation** that:
- Maintains itself through size limits
- Enables parallel development through clear boundaries
- Performs 3x better through design, not tricks
- Serves as the foundation for future language targets

**Remember**: The Python implementation proves what happens without discipline. Don't repeat those mistakes.