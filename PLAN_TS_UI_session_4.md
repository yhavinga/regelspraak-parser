# RegelSpraak UI Session 4: REPL Implementation

**Goal**: Build an interactive console (REPL) that matches the VISION.md CLI functionality in a web interface.

**Duration**: 4-6 hours

**Prerequisites**: Completed Sessions 1-3, parser and execution engine working

## Deliverables

1. Terminal-style console component
2. Command parser with special commands
3. Execution context management
4. Command history and auto-completion
5. Python-style context manipulation

## Implementation Steps

### 1. Terminal Component Library (30 min)

Install and configure terminal components:

```bash
cd /home/yeb/regelspraak-parser/frontend
npm install xterm xterm-addon-fit xterm-addon-web-links
npm install react-terminal-ui
```

### 2. REPL Service Implementation (1 hour)

Create `src/services/repl-service.ts`:

```typescript
import { DomainModel } from '../lib/parser/regelspraak/ast/domain-model';
import { Context } from '../lib/parser/regelspraak/runtime/context';
import { Engine } from '../lib/parser/regelspraak/engine/engine';
import { parserService } from './parser-service';

export interface REPLCommand {
  type: 'regelspraak' | 'evaluate' | 'execute' | 'load' | 'py' | 'help' | 'clear';
  command: string;
  args?: string[];
}

export interface REPLResult {
  success: boolean;
  output: string;
  error?: string;
  type: 'text' | 'value' | 'error' | 'info';
}

export class REPLService {
  private engine: Engine;
  private context: Context;
  private model: DomainModel | null = null;
  private multilineBuffer: string[] = [];
  private isMultiline: boolean = false;
  
  constructor() {
    this.engine = new Engine();
    this.context = new Context();
  }
  
  async processInput(input: string): Promise<REPLResult> {
    // Handle multiline input
    if (input.trim() === '.') {
      if (this.isMultiline) {
        const fullInput = this.multilineBuffer.join('\n');
        this.multilineBuffer = [];
        this.isMultiline = false;
        return this.processCommand(fullInput);
      }
      return { success: false, output: 'Not in multiline mode', type: 'error' };
    }
    
    // Check if this starts a multiline input
    if (this.looksLikeRegelSpraak(input) && !input.endsWith('.')) {
      this.isMultiline = true;
      this.multilineBuffer.push(input);
      return { success: true, output: '>>>', type: 'info' };
    }
    
    if (this.isMultiline) {
      this.multilineBuffer.push(input);
      return { success: true, output: '>>>', type: 'info' };
    }
    
    return this.processCommand(input);
  }
  
  private async processCommand(input: string): Promise<REPLResult> {
    const trimmed = input.trim();
    
    // Parse command type
    if (trimmed.startsWith('Evaluate ')) {
      return this.evaluateExpression(trimmed.substring(9));
    } else if (trimmed.startsWith('Execute ')) {
      return this.executeRule(trimmed.substring(8));
    } else if (trimmed.startsWith('Load ')) {
      return this.loadFile(trimmed.substring(5));
    } else if (trimmed.startsWith('py: ')) {
      return this.executePython(trimmed.substring(4));
    } else if (trimmed === 'help') {
      return this.showHelp();
    } else if (trimmed === 'clear') {
      return { success: true, output: '\x1b[2J\x1b[H', type: 'text' };
    } else if (trimmed === 'exit') {
      return { success: true, output: 'Use the UI close button to exit', type: 'info' };
    } else if (this.looksLikeRegelSpraak(trimmed)) {
      return this.parseRegelSpraak(trimmed);
    } else {
      return { 
        success: false, 
        output: `Unknown command: ${trimmed}\nType 'help' for available commands`, 
        type: 'error' 
      };
    }
  }
  
  private looksLikeRegelSpraak(input: string): boolean {
    const keywords = ['Objecttype', 'Parameter', 'Regel', 'Beslistabel', 'Domein'];
    return keywords.some(kw => input.trim().startsWith(kw));
  }
  
  private async parseRegelSpraak(code: string): Promise<REPLResult> {
    try {
      const result = await parserService.parse(code);
      
      if (!result.success) {
        return {
          success: false,
          output: `Parse error: ${result.errors[0]?.message || 'Unknown error'}`,
          type: 'error'
        };
      }
      
      // Merge with existing model
      if (this.model) {
        this.mergeModel(result.model!);
      } else {
        this.model = result.model!;
      }
      
      // Extract what was defined
      const defined = this.extractDefinitions(code);
      return {
        success: true,
        output: defined.map(d => `Defined ${d.type}: ${d.name}`).join('\n'),
        type: 'info'
      };
    } catch (error) {
      return {
        success: false,
        output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      };
    }
  }
  
  private mergeModel(newModel: DomainModel) {
    if (!this.model) {
      this.model = newModel;
      return;
    }
    
    // Merge object types
    newModel.objectTypes.forEach((type, name) => {
      this.model!.objectTypes.set(name, type);
    });
    
    // Merge parameters
    newModel.parameters.forEach((param, name) => {
      this.model!.parameters.set(name, param);
    });
    
    // Merge rules
    this.model.rules.push(...newModel.rules);
    
    // Merge other elements...
  }
  
  private extractDefinitions(code: string): Array<{type: string, name: string}> {
    const definitions: Array<{type: string, name: string}> = [];
    const lines = code.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('Objecttype ')) {
        const match = trimmed.match(/Objecttype\s+(?:de\s+|het\s+)?(\w+)/);
        if (match) definitions.push({ type: 'Objecttype', name: match[1] });
      } else if (trimmed.startsWith('Parameter ')) {
        const match = trimmed.match(/Parameter\s+(?:de\s+|het\s+)?([\w\s]+?)(?:\s*:)/);
        if (match) definitions.push({ type: 'Parameter', name: match[1].trim() });
      } else if (trimmed.startsWith('Regel ')) {
        const match = trimmed.match(/Regel\s+([\w\s]+?)$/);
        if (match) definitions.push({ type: 'Regel', name: match[1].trim() });
      }
    });
    
    return definitions;
  }
  
  private async evaluateExpression(expression: string): Promise<REPLResult> {
    if (!this.model) {
      return {
        success: false,
        output: 'No model loaded. Define some rules first.',
        type: 'error'
      };
    }
    
    try {
      const result = await this.engine.evaluateExpression(expression, this.context);
      return {
        success: true,
        output: this.formatValue(result),
        type: 'value'
      };
    } catch (error) {
      return {
        success: false,
        output: `Evaluation error: ${error instanceof Error ? error.message : 'Unknown'}`,
        type: 'error'
      };
    }
  }
  
  private async executeRule(ruleName: string): Promise<REPLResult> {
    if (!this.model) {
      return {
        success: false,
        output: 'No model loaded',
        type: 'error'
      };
    }
    
    const rule = this.model.rules.find(r => r.name === ruleName);
    if (!rule) {
      return {
        success: false,
        output: `Rule not found: ${ruleName}`,
        type: 'error'
      };
    }
    
    try {
      const trace = await this.engine.executeRule(rule, this.context);
      return {
        success: true,
        output: `Executing Regel ${ruleName}...\n${this.formatTrace(trace)}`,
        type: 'text'
      };
    } catch (error) {
      return {
        success: false,
        output: `Execution error: ${error instanceof Error ? error.message : 'Unknown'}`,
        type: 'error'
      };
    }
  }
  
  private executePython(code: string): REPLResult {
    // Simulate Python-style context manipulation
    try {
      if (code.includes('set_parameter')) {
        const match = code.match(/set_parameter\("(.+?)",\s*(.+?)(?:,\s*"(.+?)")?\)/);
        if (match) {
          const [, name, value, unit] = match;
          this.context.setVariable(name, {
            type: 'number',
            value: parseFloat(value),
            unit
          });
          return {
            success: true,
            output: `Parameter '${name}' set to ${value}${unit ? ' ' + unit : ''}`,
            type: 'info'
          };
        }
      } else if (code.includes('create_instance')) {
        const match = code.match(/(\w+)\s*=\s*context\.create_instance\("(.+?)"\)/);
        if (match) {
          const [, varName, typeName] = match;
          const instance = this.context.createObject(typeName);
          this.context.setVariable(varName, instance);
          return {
            success: true,
            output: `Created instance '${varName}' of ${typeName}`,
            type: 'info'
          };
        }
      } else if (code.includes('set_attribute')) {
        const match = code.match(/set_attribute\((\w+),\s*"(.+?)",\s*(.+?)(?:,\s*"(.+?)")?\)/);
        if (match) {
          const [, objVar, attrName, value, unit] = match;
          // Implementation would set attribute on object
          return {
            success: true,
            output: `Set ${objVar}.${attrName} to ${value}${unit ? ' ' + unit : ''}`,
            type: 'info'
          };
        }
      }
      
      return {
        success: false,
        output: 'Python command not recognized',
        type: 'error'
      };
    } catch (error) {
      return {
        success: false,
        output: `Python error: ${error instanceof Error ? error.message : 'Unknown'}`,
        type: 'error'
      };
    }
  }
  
  private loadFile(filepath: string): REPLResult {
    // In web context, this would load from a virtual file system or URL
    return {
      success: false,
      output: 'File loading not implemented in web version. Use the editor instead.',
      type: 'info'
    };
  }
  
  private showHelp(): REPLResult {
    const help = `RegelSpraak Web REPL v1.0

Available commands:
  <RegelSpraak code>     - Define objects, parameters, and rules
  Evaluate <expression>  - Evaluate a RegelSpraak expression
  Execute <rule name>    - Execute a specific rule
  py: <python code>      - Execute Python-style context commands
  help                   - Show this help message
  clear                  - Clear the console

Python context commands:
  py: context.set_parameter("name", value, "unit")
  py: obj = context.create_instance("TypeName")
  py: context.set_attribute(obj, "attribute", value, "unit")

Use '.' on a new line to end multi-line input.`;
    
    return {
      success: true,
      output: help,
      type: 'info'
    };
  }
  
  private formatValue(value: any): string {
    if (value.type === 'number') {
      return `${value.value}${value.unit ? ' ' + value.unit : ''}`;
    } else if (value.type === 'boolean') {
      return value.value ? 'waar' : 'onwaar';
    } else if (value.type === 'string') {
      return `"${value.value}"`;
    } else if (value.type === 'empty') {
      return 'leeg';
    }
    return JSON.stringify(value);
  }
  
  private formatTrace(trace: any): string {
    // Format execution trace for display
    return 'Rule executed successfully';
  }
  
  getCommandHistory(): string[] {
    // Would be implemented with persistent storage
    return [];
  }
  
  getAutoCompletions(partial: string): string[] {
    const completions: string[] = [];
    
    // Command completions
    if ('Evaluate'.startsWith(partial)) completions.push('Evaluate ');
    if ('Execute'.startsWith(partial)) completions.push('Execute ');
    if ('help'.startsWith(partial)) completions.push('help');
    
    // RegelSpraak keywords
    const keywords = ['Objecttype', 'Parameter', 'Regel', 'Beslistabel'];
    keywords.forEach(kw => {
      if (kw.toLowerCase().startsWith(partial.toLowerCase())) {
        completions.push(kw + ' ');
      }
    });
    
    return completions;
  }
}

export const replService = new REPLService();
```

### 3. Terminal UI Component (1 hour)

Create `src/components/repl/REPLTerminal.tsx`:

```typescript
import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { replService } from '../../services/repl-service';
import 'xterm/css/xterm.css';

export function REPLTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentLine, setCurrentLine] = useState('');
  
  useEffect(() => {
    if (!terminalRef.current || terminal.current) return;
    
    // Initialize terminal
    terminal.current = new Terminal({
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#aeafad',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5'
      },
      fontFamily: 'Fira Code, monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block'
    });
    
    // Add addons
    fitAddon.current = new FitAddon();
    terminal.current.loadAddon(fitAddon.current);
    terminal.current.loadAddon(new WebLinksAddon());
    
    // Open terminal in DOM
    terminal.current.open(terminalRef.current);
    fitAddon.current.fit();
    
    // Write welcome message
    terminal.current.writeln('RegelSpraak Interpreter v1.0 (Web Edition)');
    terminal.current.writeln('Type \'help\' for available commands.');
    terminal.current.writeln('');
    terminal.current.write('RegelSpraak> ');
    
    // Handle input
    let currentCommand = '';
    let cursorPosition = 0;
    
    terminal.current.onData(async (data) => {
      const term = terminal.current!;
      
      // Handle special keys
      if (data === '\r') { // Enter
        term.writeln('');
        
        if (currentCommand.trim()) {
          // Add to history
          const newHistory = [...commandHistory, currentCommand];
          setCommandHistory(newHistory);
          setHistoryIndex(-1);
          
          // Process command
          const result = await replService.processInput(currentCommand);
          
          // Write output
          if (result.type === 'error') {
            term.writeln(`\x1b[31m${result.output}\x1b[0m`);
          } else if (result.type === 'value') {
            term.writeln(`\x1b[32m${result.output}\x1b[0m`);
          } else if (result.type === 'info') {
            term.writeln(`\x1b[33m${result.output}\x1b[0m`);
          } else {
            term.writeln(result.output);
          }
          
          // Show prompt (unless in multiline mode)
          if (result.output === '>>>') {
            term.write('>>> ');
          } else {
            term.write('\nRegelSpraak> ');
          }
        } else {
          term.write('RegelSpraak> ');
        }
        
        currentCommand = '';
        cursorPosition = 0;
      } else if (data === '\x7f') { // Backspace
        if (cursorPosition > 0) {
          currentCommand = 
            currentCommand.slice(0, cursorPosition - 1) + 
            currentCommand.slice(cursorPosition);
          cursorPosition--;
          
          // Update display
          term.write('\b \b');
          term.write(currentCommand.slice(cursorPosition));
          term.write('\x1b[' + (currentCommand.length - cursorPosition) + 'D');
        }
      } else if (data === '\x1b[A') { // Up arrow
        if (historyIndex < commandHistory.length - 1) {
          // Clear current line
          term.write('\x1b[' + cursorPosition + 'D');
          term.write('\x1b[K');
          
          // Show previous command
          setHistoryIndex(historyIndex + 1);
          currentCommand = commandHistory[commandHistory.length - 1 - (historyIndex + 1)];
          cursorPosition = currentCommand.length;
          term.write(currentCommand);
        }
      } else if (data === '\x1b[B') { // Down arrow
        if (historyIndex > -1) {
          // Clear current line
          term.write('\x1b[' + cursorPosition + 'D');
          term.write('\x1b[K');
          
          // Show next command
          setHistoryIndex(historyIndex - 1);
          if (historyIndex === -1) {
            currentCommand = '';
            cursorPosition = 0;
          } else {
            currentCommand = commandHistory[commandHistory.length - 1 - historyIndex];
            cursorPosition = currentCommand.length;
            term.write(currentCommand);
          }
        }
      } else if (data === '\t') { // Tab completion
        const completions = replService.getAutoCompletions(currentCommand);
        if (completions.length === 1) {
          const completion = completions[0];
          const remaining = completion.slice(currentCommand.length);
          currentCommand = completion;
          cursorPosition = completion.length;
          term.write(remaining);
        } else if (completions.length > 1) {
          term.writeln('');
          completions.forEach(c => term.writeln('  ' + c));
          term.write('RegelSpraak> ' + currentCommand);
        }
      } else if (data >= ' ') { // Regular character
        currentCommand = 
          currentCommand.slice(0, cursorPosition) + 
          data + 
          currentCommand.slice(cursorPosition);
        cursorPosition += data.length;
        
        term.write(data);
        if (cursorPosition < currentCommand.length) {
          term.write(currentCommand.slice(cursorPosition));
          term.write('\x1b[' + (currentCommand.length - cursorPosition) + 'D');
        }
      }
    });
    
    // Handle resize
    const handleResize = () => {
      if (fitAddon.current) {
        fitAddon.current.fit();
      }
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      terminal.current?.dispose();
    };
  }, [commandHistory]);
  
  return (
    <div 
      ref={terminalRef} 
      className="h-full w-full bg-gray-900"
      style={{ padding: '8px' }}
    />
  );
}
```

### 4. Simpler Terminal Alternative (45 min)

If xterm is too complex, create a simpler version with `src/components/repl/SimpleREPL.tsx`:

```typescript
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { replService } from '../../services/repl-service';

interface OutputLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'info' | 'value';
}

export function SimpleREPL() {
  const [output, setOutput] = useState<OutputLine[]>([
    { text: 'RegelSpraak Interpreter v1.0 (Web Edition)', type: 'info' },
    { text: "Type 'help' for available commands.", type: 'info' },
    { text: '', type: 'info' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMultiline, setIsMultiline] = useState(false);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleSubmit = async () => {
    if (!currentInput.trim() && !isMultiline) return;
    
    // Add input to output
    const prompt = isMultiline ? '>>> ' : 'RegelSpraak> ';
    setOutput(prev => [...prev, { 
      text: prompt + currentInput, 
      type: 'input' 
    }]);
    
    // Add to history
    if (currentInput.trim() && !isMultiline) {
      setHistory(prev => [...prev, currentInput]);
      setHistoryIndex(-1);
    }
    
    // Process command
    const result = await replService.processInput(currentInput);
    
    // Add output
    if (result.output) {
      setOutput(prev => [...prev, { 
        text: result.output, 
        type: result.type as any 
      }]);
    }
    
    // Check if entering multiline mode
    if (result.output === '>>>') {
      setIsMultiline(true);
    } else if (currentInput === '.') {
      setIsMultiline(false);
    }
    
    setCurrentInput('');
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > -1) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        if (newIndex === -1) {
          setCurrentInput('');
        } else {
          setCurrentInput(history[history.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const completions = replService.getAutoCompletions(currentInput);
      if (completions.length === 1) {
        setCurrentInput(completions[0]);
      } else if (completions.length > 1) {
        setOutput(prev => [...prev, 
          { text: 'Completions:', type: 'info' },
          ...completions.map(c => ({ text: '  ' + c, type: 'info' as const }))
        ]);
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setOutput([]);
    }
  };
  
  const getLineClass = (type: OutputLine['type']) => {
    switch (type) {
      case 'input': return 'text-gray-300';
      case 'error': return 'text-red-400';
      case 'info': return 'text-yellow-400';
      case 'value': return 'text-green-400';
      default: return 'text-gray-100';
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100 font-mono text-sm">
      <div className="flex-1 overflow-auto p-4">
        {output.map((line, index) => (
          <div key={index} className={getLineClass(line.type)}>
            <pre className="whitespace-pre-wrap">{line.text}</pre>
          </div>
        ))}
        <div ref={outputEndRef} />
      </div>
      
      <div className="border-t border-gray-700 p-4 flex items-center">
        <span className="text-gray-400 mr-2">
          {isMultiline ? '>>> ' : 'RegelSpraak> '}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-gray-100"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      
      <div className="px-4 pb-2 text-xs text-gray-500">
        Ctrl+L: Clear | Tab: Autocomplete | ↑↓: History | Enter: Submit | '.': End multiline
      </div>
    </div>
  );
}
```

### 5. Integration with Layout (30 min)

Create `src/components/repl/REPLPanel.tsx`:

```typescript
import { useState } from 'react';
import { Cross2Icon, TerminalIcon } from '@radix-ui/react-icons';
import { SimpleREPL } from './SimpleREPL';
// or import { REPLTerminal } from './REPLTerminal';

interface REPLPanelProps {
  onClose: () => void;
}

export function REPLPanel({ onClose }: REPLPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  
  return (
    <div className={`
      fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700
      transition-all duration-300
      ${isMinimized ? 'h-10' : 'h-96'}
    `}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="text-gray-400" />
          <span className="text-sm font-medium text-gray-200">
            RegelSpraak Console
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-gray-200"
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <Cross2Icon />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="h-full pb-10">
          <SimpleREPL />
        </div>
      )}
    </div>
  );
}
```

### 6. Update App Layout (30 min)

Update `src/components/layout/AppLayout.tsx` to include REPL:

```typescript
import { useState } from 'react';
import { REPLPanel } from '../repl/REPLPanel';

// Add to the layout:
export function AppLayout({ children }: AppLayoutProps) {
  const [showREPL, setShowREPL] = useState(false);
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Existing header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2">
        {/* ... existing header content ... */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowREPL(!showREPL)}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Console
          </button>
          {/* ... other buttons ... */}
        </div>
      </header>
      
      {/* Main content with REPL-aware height */}
      <main className={`flex-1 flex overflow-hidden ${showREPL ? 'pb-96' : ''}`}>
        {children}
      </main>
      
      {/* REPL Panel */}
      {showREPL && (
        <REPLPanel onClose={() => setShowREPL(false)} />
      )}
    </div>
  );
}
```

### 7. Example Usage Scenarios (30 min)

Create `src/data/repl-examples.ts`:

```typescript
export const replExamples = {
  basic: `# Basic object and rule definition
Objecttype de Persoon
    de naam Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    is volwassen kenmerk;

Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;

Regel Volwassenheid
    geldig altijd
        Een Persoon is volwassen
        indien zijn leeftijd groter of gelijk is aan de volwassenleeftijd.`,

  pythonContext: `# Setting up context with Python-style commands
py: context.set_parameter("volwassenleeftijd", 18, "jr")
py: p1 = context.create_instance("Persoon")
py: context.set_attribute(p1, "naam", "Jan Jansen")
py: context.set_attribute(p1, "leeftijd", 25, "jr")`,

  evaluation: `# Evaluating expressions
Evaluate de volwassenleeftijd
Evaluate 10 plus 20
Evaluate de leeftijd van p1`,

  execution: `# Executing rules
Execute Volwassenheid for p1
Evaluate p1 is volwassen`
};
```

## Testing & Verification

1. Test basic REPL functionality:
   ```
   RegelSpraak> help
   [Verify help text appears]
   
   RegelSpraak> Objecttype de Test
   >>>     de waarde Numeriek;
   >>> .
   Defined Objecttype: Test
   ```

2. Test Python-style commands:
   ```
   RegelSpraak> py: context.set_parameter("max", 100)
   Parameter 'max' set to 100
   
   RegelSpraak> Evaluate de max
   100
   ```

3. Test multiline input:
   ```
   RegelSpraak> Regel TestRegel
   >>> geldig altijd
   >>>     De waarde van een Test moet gesteld worden op 42.
   >>> .
   Defined Regel: TestRegel
   ```

4. Test history navigation:
   - Type several commands
   - Use ↑↓ arrows to navigate
   - Verify history works correctly

5. Test auto-completion:
   - Type "Obj" and press Tab
   - Should complete to "Objecttype "
   - Type "Eval" and press Tab
   - Should complete to "Evaluate "

## Performance Considerations

1. **Command Processing**: Parse in Web Worker if >100ms
2. **Output Buffering**: Virtual scrolling for long output
3. **History Limit**: Keep last 100 commands
4. **Memory Management**: Clear old execution contexts

## Integration Points

1. **Shared Context**: REPL shares context with Execution Playground
2. **Model Sync**: Changes in REPL reflect in editor AST
3. **Error Sync**: REPL errors appear in validation panel
4. **Export**: Can export REPL session as script

## Next Session Preview

Session 5 will implement the validation panel:
- Comprehensive error list
- Quick fix integration
- Warning system
- Performance monitoring dashboard