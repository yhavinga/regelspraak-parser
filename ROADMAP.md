# RegelSpraak Parser Roadmap

The RegelSpraak Parser has achieved 99%+ specification compliance with 568+ passing tests. All major features from the RegelSpraak v2.1.0 specification are implemented and the TOKA example validates successfully.

## AI-Powered Explainability Vision

### Prerequisites ✓ Completed
1. **Robust AST & Semantic Model** ✓
2. **Accurate Runtime Engine** ✓
3. **Basic Execution Tracing** ✓

### Step 1: Enhanced Execution Tracing
**Priority: High | Timeline: 1-2 months**

#### Trace Events to Add
- Rule evaluation start/end with instance context
- Condition evaluation with outcomes (true/false)
- Complex condition breakdown with intermediate values
- Variable/Parameter/Attribute reads with values
- Variable/Parameter/Attribute writes with old/new values
- Function calls with arguments and results
- Rule firing events with reasons
- Rule non-firing with explanations
- Object creation and kenmerk assignments

#### Event Structure (JSON)
```json
{
  "event_type": "RULE_EVAL_START",
  "timestamp": "2025-11-15T10:30:00Z",
  "rule_name": "Minderjarigheid",
  "instance_id": "person_123",
  "ast_node_span": {"start": 100, "end": 150},
  "details": {
    "context": "evaluation",
    "parameters": {...}
  }
}
```

### Step 2: Semantic Information Integration
**Priority: Medium | Timeline: 1 month**
- Link trace events to semantic model
- Include type information in traces
- Add unit context to numeric values
- Provide domain model references

### Step 3: Explanation Query Interface
**Priority: Medium | Timeline: 2 months**

#### Query Types
- "Explain rule X"
- "Why is attribute Y of instance Z equal to V?"
- "Trace the calculation of variable A"
- "What rules affected object O?"
- "Why didn't rule R fire?"

#### Implementation
- New REPL commands (`:explain`, `:trace`, `:why`)
- CLI integration (`--explain` flag)
- JSON output for programmatic access

### Step 4: LLM-Powered Explanation Generation
**Priority: Medium | Timeline: 2-3 months**

#### Components
1. **Trace Processor**
   - Filter relevant events by query
   - Build execution narrative
   - Extract key decision points

2. **Context Retriever**
   - Fetch source code snippets via SourceSpan
   - Include relevant definitions
   - Provide surrounding context

3. **Prompt Engineering**
   - Structured prompts with:
     - User question
     - Filtered trace events
     - Source code context
     - Semantic information
   - Multiple explanation styles:
     - Technical (for developers)
     - Business (for domain experts)
     - Summary (for quick understanding)

4. **LLM Integration**
   - Support multiple providers (OpenAI, Anthropic, local)
   - Streaming responses for long explanations
   - Caching for repeated queries

### Step 5: Iterative Refinement
**Priority: Low | Timeline: Ongoing**
- Start with simple single-rule explanations
- Progress to complex multi-rule interactions
- Add visualization support
- Implement feedback loop for improvement

## Minor Specification Gaps

### Remaining Edge Cases
- Parameter/attribute confusion detection enhancement
- Complete runtime testing for all phrase variants

These represent <1% of specification and don't affect production use.

## Community Features

### Documentation & Examples
- Comprehensive tutorial series
- Real-world example rule sets
- Migration guide from other rule engines
- Best practices guide

### Developer Experience
- VS Code extension with syntax highlighting
- Language server protocol implementation
- Debugging support with breakpoints
- Rule testing framework

### Integration Support
- REST API wrapper
- GraphQL schema generation
- OpenAPI specification
- Event streaming support

## Success Metrics

### Performance Goals
- Sub-100ms execution for 1000 rules
- <10MB memory per rule context
- Linear scaling with rule count
- Sub-second compilation time

### Quality Goals
- 100% specification compliance
- Zero critical bugs in production
- <1% test failure rate
- Comprehensive error messages

### Adoption Goals
- Clear migration path from competitors
- Industry-specific rule templates
- Enterprise support options
- Active community contribution