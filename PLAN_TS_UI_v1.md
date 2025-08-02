# RegelSpraak Web UI v1 - Technical Design Plan

## Core Design Philosophy

The fundamental challenge: Create a web UI that makes writing Dutch business rules as natural as writing an email, while providing the power tools experts need. The TypeScript implementation's real-time validation and source span tracking enable an IDE-quality experience in the browser.

**Carmack Principles Applied**:
- Direct manipulation over wizards
- Immediate feedback over batch validation  
- Show the actual code, always
- Performance is a feature
- Progressive disclosure of complexity

**Vision Alignment**:
This UI plan directly supports the VISION.md goals:
- **Interactive Rule Exploration**: Web-based REPL equivalent
- **Literate Programming**: Notebook-style documentation  
- **Rules as a Service**: API deployment workflow
- **AI-Enhanced Development**: LLM-powered assistance
- **Explainability**: Answering Wat/Waarom/Wat als questions

## Architecture Overview

### Technology Stack

```typescript
// Core dependencies
- React 18+ (for concurrent features and suspense)
- Monaco Editor (VS Code's editor component)
- Zustand (state management - simpler than Redux)
- TanStack Query (server state caching)
- Vite (build tool - fastest HMR)
- Tailwind CSS (utility-first styling)
- Radix UI (accessible headless components)
```

**Why these choices**:
- Monaco provides professional IDE features out-of-the-box
- React 18's concurrent rendering prevents UI blocking during parsing
- Zustand's simplicity matches our direct manipulation philosophy
- Vite's sub-50ms HMR enables true live coding

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     RegelSpraak Web UI                      │
├─────────────────┬───────────────────┬──────────────────────┤
│   Editor Layer  │  Validation Layer │   Execution Layer    │
├─────────────────┼───────────────────┼──────────────────────┤
│ Monaco Editor   │ TypeScript Parser │  Runtime Engine      │
│ Auto-complete   │ Semantic Analyzer │  Trace Visualizer    │
│ Syntax Highlight│ Error Decorations │  Result Inspector    │
└─────────────────┴───────────────────┴──────────────────────┘
```

## Dual-Mode Editor Design

### 1. Guided Mode (Beginners)

**Concept**: Structure-aware forms that generate valid RegelSpraak code.

```typescript
interface GuidedModeState {
  activeConstruct: 'objectType' | 'rule' | 'parameter' | 'decisionTable';
  currentForm: ConstructForm;
  generatedCode: string;
  validationErrors: SemanticError[];
}
```

**Key Features**:
- **Smart Templates**: Pre-fill common patterns
- **Contextual Help**: Inline documentation for each field
- **Live Preview**: Show generated RegelSpraak code as user types
- **Progressive Disclosure**: Hide advanced options initially

**Example: Rule Builder Interface**

```
┌─ Nieuwe Regel ────────────────────────────────────────┐
│ Regel naam: [Minderjarigheid check_______________]    │
│                                                       │
│ Wanneer is deze regel van toepassing?                │
│ ○ Altijd                                             │
│ ● Voor alle: [Natuurlijk persoon ▼]                 │
│ ○ Alleen wanneer: [_________________________]       │
│                                                       │
│ Wat moet er gebeuren?                                │
│ [Een Natuurlijk persoon] [is ▼] [minderjarig ▼]     │
│                                                       │
│ ☑ Voeg voorwaarde toe                               │
│   └─ indien [zijn ▼] [leeftijd ▼] [kleiner is dan ▼]│
│      [de volwassenleeftijd_____________]             │
│                                                       │
│ ─────────────────────────────────────────────────── │
│ Preview:                                             │
│ Regel Minderjarigheid check                         │
│ geldig voor alle Natuurlijk persoon                 │
│     Een Natuurlijk persoon is minderjarig           │
│     indien zijn leeftijd kleiner is dan             │
│     de volwassenleeftijd.                          │
└──────────────────────────────────────────────────────┘
```

### 2. Expert Mode (Power Users)

**Concept**: Full Monaco editor with RegelSpraak language server features.

```typescript
interface ExpertModeFeatures {
  syntaxHighlighting: CustomMonacoTheme;
  autoComplete: RegelSpraakCompletionProvider;
  hoverProvider: RegelSpraakHoverProvider;
  codeActions: QuickFixProvider;
  formatting: RegelSpraakFormatter;
  snippets: RegelSpraakSnippets;
}
```

**Key Features**:
- **IntelliSense**: Context-aware completions
- **Real-time Validation**: Squiggly lines for errors
- **Quick Fixes**: Auto-correct common mistakes
- **Multi-cursor Editing**: For repetitive changes
- **Code Folding**: Collapse/expand constructs
- **Minimap**: Visual code overview

## Core UI Components

### 1. Smart Editor Component

```typescript
interface SmartEditorProps {
  mode: 'guided' | 'expert';
  value: string;
  onChange: (value: string) => void;
  validationErrors: SemanticError[];
  executionTrace?: ExecutionTrace;
}

const SmartEditor: React.FC<SmartEditorProps> = ({
  mode, value, onChange, validationErrors, executionTrace
}) => {
  // Concurrent parsing with React 18
  const deferredValue = useDeferredValue(value);
  const parseResult = useMemo(
    () => parseRegelSpraak(deferredValue),
    [deferredValue]
  );
  
  // Real-time validation without blocking UI
  useEffect(() => {
    startTransition(() => {
      validateModel(parseResult);
    });
  }, [parseResult]);
  
  return mode === 'guided' 
    ? <GuidedEditor {...props} />
    : <MonacoEditor {...props} />;
};
```

### 2. Live Validation Panel

```typescript
interface ValidationPanelProps {
  errors: SemanticError[];
  warnings: SemanticWarning[];
  model: DomainModel;
}

// Visual feedback with source locations
const ValidationPanel: React.FC<ValidationPanelProps> = ({
  errors, warnings, model
}) => {
  return (
    <div className="validation-panel">
      {errors.map(error => (
        <ErrorCard
          key={error.id}
          error={error}
          onClick={() => jumpToLocation(error.span)}
          quickFix={getQuickFix(error, model)}
        />
      ))}
    </div>
  );
};
```

### 3. Execution Playground

```typescript
interface PlaygroundProps {
  model: DomainModel;
  testData: TestScenario[];
}

const ExecutionPlayground: React.FC<PlaygroundProps> = ({
  model, testData
}) => {
  // Interactive test data editor
  const [scenario, setScenario] = useState<TestScenario>(
    testData[0] || createEmptyScenario(model)
  );
  
  // Live execution with trace
  const result = useQuery({
    queryKey: ['execute', model, scenario],
    queryFn: () => executeModel(model, scenario),
    staleTime: 0 // Always fresh
  });
  
  return (
    <SplitPane>
      <TestDataEditor
        schema={model}
        value={scenario}
        onChange={setScenario}
      />
      <ExecutionResults
        trace={result.data?.trace}
        output={result.data?.output}
        isLoading={result.isLoading}
      />
    </SplitPane>
  );
};
```

### 4. Visual Rule Debugger

```typescript
interface DebuggerProps {
  trace: ExecutionTrace;
  sourceMap: SourceMap;
}

const RuleDebugger: React.FC<DebuggerProps> = ({
  trace, sourceMap
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = trace.steps[currentStep];
  
  return (
    <div className="debugger">
      <SourceView
        highlightedSpan={step.span}
        sourceMap={sourceMap}
      />
      <VariableInspector
        context={step.context}
        changes={step.changes}
      />
      <StepControls
        currentStep={currentStep}
        totalSteps={trace.steps.length}
        onStepChange={setCurrentStep}
      />
    </div>
  );
};
```

## Advanced Features

### 1. Notebook-Style Literate Programming

```typescript
interface NotebookCell {
  id: string;
  type: 'markdown' | 'regelspraak' | 'test-data' | 'result';
  content: string;
  output?: ExecutionResult;
  metadata: CellMetadata;
}

const RegelSpraakNotebook: React.FC = () => {
  const [cells, setCells] = useState<NotebookCell[]>([]);
  const [kernelState, setKernelState] = useState<DomainModel>();
  
  // Persistent kernel state across cells
  const executeCell = async (cellId: string) => {
    const cell = cells.find(c => c.id === cellId);
    if (cell?.type === 'regelspraak') {
      const newState = await parseAndMerge(kernelState, cell.content);
      setKernelState(newState);
      updateCellOutput(cellId, newState);
    }
  };
  
  return (
    <NotebookEditor
      cells={cells}
      onExecute={executeCell}
      onAddCell={addCell}
      supportedLanguages={['regelspraak', 'markdown']}
    />
  );
};
```

### 2. Enhanced AI-Powered Assistance

```typescript
interface AIAssistant {
  // Natural language to RegelSpraak
  generateRule(description: string, context: DomainModel): Promise<string>;
  
  // Explainability features (aligned with VISION.md)
  explainDecision(trace: ExecutionTrace): Promise<{
    wat: string;        // What was decided
    waarom: string;     // Why this decision  
    watAls: string[];   // What-if scenarios
    waaromNiet: string; // Why other paths weren't taken
    hoeTe: string;      // How to achieve different outcome
  }>;
  
  // Interactive chat interface
  chatWithRules(question: string, context: ExecutionContext): Promise<{
    answer: string;
    suggestedActions: Action[];
    relatedRules: Rule[];
  }>;
  
  // Goal-seeking
  suggestChanges(
    currentState: TestScenario,
    desiredOutcome: Partial<TestScenario>
  ): Promise<ChangeSet>;
}

// LLM-powered chat panel
const AIChat: React.FC<{model: DomainModel}> = ({ model }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const handleQuestion = async (question: string) => {
    // Convert natural language to engine queries
    const engineQuery = await ai.parseQuestion(question);
    const result = await engine.execute(engineQuery);
    const explanation = await ai.explainDecision(result.trace);
    
    setMessages([
      ...messages,
      { role: 'user', content: question },
      { role: 'assistant', content: explanation.waarom, actions: explanation.suggestedActions }
    ]);
  };
  
  return <ChatInterface onSubmit={handleQuestion} messages={messages} />;
};
```

### 3. Rules as a Service - Deployment Pipeline

```typescript
interface DeploymentFeatures {
  // API Preview
  generateOpenAPI(model: DomainModel): OpenAPISpec;
  previewEndpoints(model: DomainModel): APIEndpoint[];
  
  // Deployment workflow  
  deployToStaging(model: DomainModel): Promise<DeploymentResult>;
  promoteToProduction(stagingId: string): Promise<void>;
  
  // Monitoring
  getAPIMetrics(deploymentId: string): APIMetrics;
  getDecisionLogs(timeRange: TimeRange): DecisionLog[];
}

const APIDeploymentPanel: React.FC<{model: DomainModel}> = ({ model }) => {
  const [openAPIPreview, setOpenAPIPreview] = useState<string>();
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>();
  
  useEffect(() => {
    const spec = generateOpenAPI(model);
    setOpenAPIPreview(spec);
  }, [model]);
  
  return (
    <div className="deployment-panel">
      <SwaggerUIPreview spec={openAPIPreview} />
      <DeploymentActions
        onDeploy={() => deployToStaging(model)}
        status={deploymentStatus}
      />
      <EndpointTester endpoints={previewEndpoints(model)} />
    </div>
  );
};
```

### 4. Advanced Explainability UI

```typescript
interface ExplainabilityFeatures {
  // Visual trace with why-not analysis
  traceVisualization: {
    showExecutedPath: boolean;
    showSkippedBranches: boolean;
    showFailedConditions: boolean;
  };
  
  // Natural language Q&A
  questionTemplates: QuestionTemplate[];
  
  // Goal seeking UI
  outcomeDesigner: OutcomeDesigner;
}

const WhyNotAnalyzer: React.FC<{trace: ExecutionTrace}> = ({ trace }) => {
  const skippedRules = analyzeSkippedRules(trace);
  
  return (
    <div className="why-not-panel">
      <h3>Why these rules didn't fire:</h3>
      {skippedRules.map(rule => (
        <RuleCard key={rule.name}>
          <RuleName>{rule.name}</RuleName>
          <FailedConditions>
            {rule.failedConditions.map(cond => (
              <Condition key={cond.id}>
                <ConditionText>{cond.text}</ConditionText>
                <ActualValue>{cond.actualValue}</ActualValue>
                <RequiredValue>{cond.requiredValue}</RequiredValue>
                <QuickFix onClick={() => applyFix(cond.fix)} />
              </Condition>
            ))}
          </FailedConditions>
        </RuleCard>
      ))}
    </div>
  );
};
```

### 5. REPL-Style Interactive Console

```typescript
interface WebREPL {
  // Command processing
  executeCommand(cmd: string): Promise<REPLResult>;
  
  // Context management
  context: RuntimeContext;
  history: CommandHistory;
  
  // Special commands
  commands: {
    evaluate: (expr: string) => Value;
    execute: (ruleName: string) => ExecutionResult;
    load: (file: string) => DomainModel;
    py: (pythonCode: string) => any; // Python interop
  };
}

const InteractiveConsole: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<REPLOutput[]>([]);
  const repl = useREPL();
  
  const handleCommand = async (cmd: string) => {
    const result = await repl.executeCommand(cmd);
    setOutput([...output, 
      { type: 'command', text: cmd },
      { type: 'result', text: result.formatted }
    ]);
  };
  
  return (
    <Terminal
      prompt="RegelSpraak>"
      onCommand={handleCommand}
      history={repl.history}
      autoComplete={getAutoCompletions}
    />
  );
};
```

## Performance Optimizations

### 1. Web Worker Parsing

```typescript
// parser.worker.ts
const parseWorker = new Worker(
  new URL('./parser.worker.ts', import.meta.url),
  { type: 'module' }
);

// Offload parsing to prevent UI blocking
async function parseInWorker(code: string): Promise<ParseResult> {
  return new Promise((resolve) => {
    parseWorker.postMessage({ type: 'parse', code });
    parseWorker.onmessage = (e) => resolve(e.data);
  });
}
```

### 2. Incremental Parsing

```typescript
interface IncrementalParser {
  // Only reparse changed sections
  applyEdit(edit: TextEdit): ParseResult;
  
  // Reuse unchanged AST nodes
  reuseNodes: Map<string, ASTNode>;
  
  // Track dirty regions
  dirtyRanges: Range[];
}
```

### 3. Virtual Scrolling

```typescript
// For large RegelSpraak files
const VirtualEditor = () => {
  const rowVirtualizer = useVirtual({
    size: lineCount,
    parentRef: scrollRef,
    estimateSize: useCallback(() => 20, []),
    overscan: 10
  });
  
  return (
    <div ref={scrollRef} style={{ height: '100%', overflow: 'auto' }}>
      <div style={{ height: rowVirtualizer.totalSize }}>
        {rowVirtualizer.virtualItems.map(virtualRow => (
          <Line 
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              height: virtualRow.size
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

## Implementation Phases

### Phase 1: Core Editor & REPL (Week 1-2)
- Monaco integration with basic syntax highlighting
- Real-time parsing using TypeScript implementation
- Error decorations with source spans
- Interactive console (REPL) implementation
- Basic guided mode for rules

### Phase 2: Validation & Execution (Week 3-4)
- Semantic validation panel
- Test data editor
- Execution playground with trace visualization
- WhyNot analyzer for failed conditions
- Performance optimizations (Web Workers)

### Phase 3: AI Integration (Week 5-6)
- LLM backend service setup
- Natural language to RegelSpraak conversion
- Explainability chat interface
- Goal-seeking UI
- Auto-completion provider with AI suggestions

### Phase 4: Notebook & Deployment (Week 7-8)
- Notebook-style interface
- API preview and deployment workflow
- OpenAPI generation
- Export/import functionality

### Phase 5: Polish & Testing (Week 9-10)
- Responsive design for tablets
- Accessibility (WCAG AA)
- Performance profiling
- User testing with actual RegelSpraak users
- Documentation and tutorials

## Technical Challenges & Solutions

### 1. Large File Performance

**Problem**: RegelSpraak files can be 10,000+ lines.

**Solution**: 
- Virtual scrolling in Monaco
- Incremental parsing
- Lazy loading of validation results

### 2. Real-time Collaboration

**Problem**: Concurrent edits need conflict resolution.

**Solution**:
- CRDT-based text synchronization
- Operational transformation for rule-level changes
- Awareness protocol for cursor positions

### 3. Mobile Responsiveness

**Problem**: Complex IDE features on small screens.

**Solution**:
- Progressive enhancement
- Touch-optimized guided mode
- Simplified mobile layout

## Metrics & Success Criteria

### Performance Targets
- Parse time: <50ms for 1000 lines
- Validation time: <100ms for full model
- First contentful paint: <1s
- Time to interactive: <2s

### User Experience Metrics
- Time to write first rule: <5 minutes (beginners)
- Error resolution time: <30s average
- Feature discovery: 80% find advanced features

### Code Quality Metrics
- TypeScript coverage: 100%
- Lighthouse score: >95
- Bundle size: <500KB gzipped

## Future Enhancements

### v2 Features
- Visual rule builder (flowchart style)
- Natural language query interface
- Integration with enterprise rule engines
- RegelSpraak learning mode with tutorials

### v3 Vision
- AI-powered rule generation from examples
- Automated test case generation
- Performance profiling of rules
- Rule impact analysis

## LLM Integration Architecture

### Backend Service Design

```typescript
// LLM Service API
interface LLMService {
  // Core endpoints
  '/api/llm/generate-rule': {
    input: { description: string; context: DomainModel };
    output: { regelspraak: string; confidence: number };
  };
  
  '/api/llm/explain': {
    input: { trace: ExecutionTrace; question?: string };
    output: ExplainabilityResult;
  };
  
  '/api/llm/chat': {
    input: { message: string; history: ChatMessage[]; context: DomainModel };
    output: { response: string; suggestedCode?: string };
  };
  
  '/api/llm/goal-seek': {
    input: { current: TestScenario; desired: Partial<TestScenario> };
    output: { changes: ChangeSet; explanation: string };
  };
}

// Prompt engineering for RegelSpraak
class RegelSpraakPromptBuilder {
  buildGenerationPrompt(description: string, context: DomainModel): string {
    return `
Je bent een RegelSpraak expert. Gegeven de volgende context:

Objecttypes: ${this.formatObjectTypes(context.objectTypes)}
Parameters: ${this.formatParameters(context.parameters)}

Schrijf een RegelSpraak regel voor: "${description}"

Gebruik alleen bestaande objecttypes en parameters.
Volg de RegelSpraak v2.1.0 syntax exact.
`;
  }
  
  buildExplainPrompt(trace: ExecutionTrace): string {
    return `
Leg uit wat er gebeurde in deze RegelSpraak uitvoering:

${this.formatTrace(trace)}

Beantwoord:
- Wat werd besloten?
- Waarom deze beslissing?
- Welke voorwaarden waren doorslaggevend?

Gebruik eenvoudig Nederlands, vermijd technisch jargon.
`;
  }
}
```

### Frontend Integration

```typescript
// Custom hooks for LLM features
const useLLMAssistant = () => {
  const queryClient = useQueryClient();
  
  const generateRule = useMutation({
    mutationFn: async (description: string) => {
      const response = await fetch('/api/llm/generate-rule', {
        method: 'POST',
        body: JSON.stringify({ description, context: getCurrentModel() })
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Insert generated code at cursor position
      insertAtCursor(data.regelspraak);
    }
  });
  
  const explainDecision = useQuery({
    queryKey: ['explain', currentTrace],
    queryFn: () => llmService.explain(currentTrace),
    enabled: !!currentTrace
  });
  
  return { generateRule, explainDecision };
};
```

## Conclusion

This enhanced UI design fully aligns with the VISION.md goals by providing:

1. **Interactive Rule Exploration**: Web-based REPL that surpasses the CLI vision
2. **Literate Programming**: Full notebook support for documentation and analysis
3. **Rules as a Service**: Complete deployment pipeline with API preview
4. **AI-Enhanced Development**: Deep LLM integration for authoring and explainability
5. **Comprehensive Explainability**: Answers all key questions (Wat/Waarom/Wat als/Waarom niet/Hoe te)

The key insight remains: Don't hide the RegelSpraak code. Show it always, make it beautiful with syntax highlighting, and provide tools to manipulate it directly. But now we also embrace AI as a partner - not to replace understanding, but to enhance it. The LLM explains what the engine executes, ensuring both correctness and comprehension.

By following Carmack's principles while integrating modern AI capabilities, we create a tool that's revolutionary for business rule development: as approachable as chatting with a colleague, as powerful as a professional IDE, and as trustworthy as formal verification.