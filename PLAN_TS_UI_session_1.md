# RegelSpraak UI Session 1: Project Setup & Monaco Editor

**Goal**: Set up the React project with TypeScript and integrate Monaco Editor with basic RegelSpraak syntax highlighting.

**Duration**: 4-6 hours

**Prerequisites**: Node.js 18+, npm/yarn

## Deliverables

1. Working React app with TypeScript
2. Monaco Editor displaying RegelSpraak code
3. Basic syntax highlighting for RegelSpraak keywords
4. Project structure ready for future sessions

## Implementation Steps

### 1. Project Initialization (30 min)

```bash
cd /home/yeb/regelspraak-parser
mkdir frontend
cd frontend

# Initialize Vite project with React TypeScript template
npm create vite@latest . -- --template react-ts

# Install core dependencies
npm install
npm install monaco-editor @monaco-editor/react
npm install zustand @tanstack/react-query
npm install @radix-ui/themes tailwindcss
```

### 2. Project Structure Setup (30 min)

Create the following directory structure:

```
frontend/
├── src/
│   ├── components/
│   │   ├── editor/
│   │   │   ├── MonacoEditor.tsx
│   │   │   └── EditorToolbar.tsx
│   │   └── layout/
│   │       └── AppLayout.tsx
│   ├── lib/
│   │   ├── monaco/
│   │   │   ├── regelspraak-language.ts
│   │   │   └── regelspraak-theme.ts
│   │   └── parser/
│   │       └── parser-worker.ts
│   ├── stores/
│   │   └── editor-store.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
└── package.json
```

### 3. RegelSpraak Language Definition (1 hour)

Create `src/lib/monaco/regelspraak-language.ts`:

```typescript
import * as monaco from 'monaco-editor';

export const REGELSPRAAK_LANGUAGE_ID = 'regelspraak';

// Keywords from RegelSpraakLexer.g4
const keywords = [
  'Regel', 'Objecttype', 'Parameter', 'Beslistabel', 'Domein',
  'geldig', 'altijd', 'indien', 'moet', 'berekend', 'worden', 'als',
  'is', 'zijn', 'heeft', 'hebben', 'met', 'van', 'de', 'het', 'een',
  'plus', 'min', 'maal', 'gedeeld door', 'tot de macht',
  'groter dan', 'kleiner dan', 'gelijk aan',
  'waar', 'onwaar', 'leeg', 'gevuld',
  'kenmerk', 'rol', 'Numeriek', 'Tekst', 'Boolean', 'Datum'
];

const typeKeywords = [
  'Numeriek', 'Tekst', 'Boolean', 'Percentage', 
  'Datum in dagen', 'Datum en tijd in millisecondes'
];

export const regelspraakLanguage: monaco.languages.IMonarchLanguage = {
  defaultToken: '',
  keywords,
  typeKeywords,
  
  tokenizer: {
    root: [
      // Comments
      [/\/\/.*$/, 'comment'],
      
      // String literals
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string'],
      
      // Numbers with units
      [/\d+(\.\d+)?\s*(jr|km|EUR|%)/, 'number.unit'],
      
      // Numbers
      [/\d+\.\d+/, 'number.float'],
      [/\d+/, 'number'],
      
      // Identifiers
      [/[a-zA-Z_]\w*/, {
        cases: {
          '@keywords': 'keyword',
          '@typeKeywords': 'type',
          '@default': 'identifier'
        }
      }],
    ],
    
    string: [
      [/[^\\"]+/, 'string'],
      [/\\./, 'string.escape'],
      [/"/, 'string', '@pop']
    ]
  }
};

export function registerRegelSpraakLanguage() {
  monaco.languages.register({ id: REGELSPRAAK_LANGUAGE_ID });
  monaco.languages.setMonarchTokensProvider(
    REGELSPRAAK_LANGUAGE_ID, 
    regelspraakLanguage
  );
}
```

### 4. Monaco Theme Configuration (30 min)

Create `src/lib/monaco/regelspraak-theme.ts`:

```typescript
import * as monaco from 'monaco-editor';

export const regelspraakTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
    { token: 'type', foreground: '267F99' },
    { token: 'string', foreground: 'A31515' },
    { token: 'number', foreground: '098658' },
    { token: 'number.unit', foreground: '098658', fontStyle: 'italic' },
    { token: 'comment', foreground: '008000', fontStyle: 'italic' },
    { token: 'identifier', foreground: '001080' }
  ],
  colors: {
    'editor.foreground': '#000000',
    'editor.background': '#FFFFFF',
    'editorCursor.foreground': '#000000',
    'editor.lineHighlightBackground': '#F5F5F5',
    'editorLineNumber.foreground': '#999999',
    'editor.selectionBackground': '#ADD6FF',
    'editor.inactiveSelectionBackground': '#E5EBF1'
  }
};

export function registerRegelSpraakTheme() {
  monaco.editor.defineTheme('regelspraak-theme', regelspraakTheme);
}
```

### 5. Editor Component Implementation (1 hour)

Create `src/components/editor/MonacoEditor.tsx`:

```typescript
import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import Editor, { Monaco } from '@monaco-editor/react';
import { registerRegelSpraakLanguage } from '../../lib/monaco/regelspraak-language';
import { registerRegelSpraakTheme } from '../../lib/monaco/regelspraak-theme';
import { useEditorStore } from '../../stores/editor-store';

export function MonacoEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { code, setCode } = useEditorStore();
  
  const handleEditorWillMount = (monaco: Monaco) => {
    // Register language and theme before editor mounts
    registerRegelSpraakLanguage();
    registerRegelSpraakTheme();
  };
  
  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      wrappingIndent: 'indent',
      automaticLayout: true,
      formatOnPaste: true,
      formatOnType: true
    });
    
    // Set up auto-save
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);
    });
  };
  
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="regelspraak"
        defaultValue={code}
        theme="regelspraak-theme"
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: 'Fira Code, monospace',
          lineNumbers: 'on',
          rulers: [80],
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true
          }
        }}
      />
    </div>
  );
}
```

### 6. Editor Store Setup (30 min)

Create `src/stores/editor-store.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EditorState {
  code: string;
  fileName: string;
  isDirty: boolean;
  setCode: (code: string) => void;
  setFileName: (name: string) => void;
  markClean: () => void;
}

const DEFAULT_CODE = `# RegelSpraak Voorbeeld

Objecttype de Persoon
    de naam Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    is volwassen kenmerk;

Parameter de meerderjarigheidsleeftijd : Numeriek (geheel getal) met eenheid jr;

Regel Volwassenheid bepalen
    geldig altijd
        Een Persoon is volwassen
        indien zijn leeftijd groter of gelijk is aan de meerderjarigheidsleeftijd.
`;

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      code: DEFAULT_CODE,
      fileName: 'untitled.rs',
      isDirty: false,
      
      setCode: (code) =>
        set((state) => ({
          code,
          isDirty: state.code !== code
        })),
        
      setFileName: (fileName) => set({ fileName }),
      
      markClean: () => set({ isDirty: false })
    }),
    {
      name: 'regelspraak-editor'
    }
  )
);
```

### 7. Main App Component (30 min)

Update `src/App.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { AppLayout } from './components/layout/AppLayout';
import { MonacoEditor } from './components/editor/MonacoEditor';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme appearance="light" accentColor="blue">
        <AppLayout>
          <MonacoEditor />
        </AppLayout>
      </Theme>
    </QueryClientProvider>
  );
}

export default App;
```

### 8. Basic Layout Component (30 min)

Create `src/components/layout/AppLayout.tsx`:

```typescript
import { ReactNode } from 'react';
import { useEditorStore } from '../../stores/editor-store';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { fileName, isDirty } = useEditorStore();
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">
              RegelSpraak Editor
            </h1>
            <span className="text-sm text-gray-600">
              {fileName} {isDirty && '*'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Run
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
```

### 9. Tailwind Configuration (15 min)

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

Update `src/index.css`:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@font-face {
  font-family: 'Fira Code';
  src: url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap');
}
```

## Testing & Verification

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Verify the following:
   - Monaco Editor loads with RegelSpraak syntax highlighting
   - Keywords are highlighted in blue
   - Numbers with units (e.g., "18 jr") are recognized
   - String literals are highlighted
   - Code persists on page reload
   - Editor shows file name and dirty state

3. Test syntax highlighting with this code:
   ```regelspraak
   // Test alle highlighting features
   Objecttype de Vlucht
       de afstand Numeriek (niet-negatief getal) met eenheid km;
       de prijs Numeriek (getal met 2 decimalen) met eenheid EUR;
       is internationaal kenmerk;
   
   Regel Prijsberekening
       geldig altijd
           De prijs van een Vlucht moet berekend worden als
           100 EUR plus (de afstand van de vlucht maal 0.50 EUR/km).
   ```

## Next Session Preview

Session 2 will integrate the TypeScript RegelSpraak parser:
- Set up Web Worker for parsing
- Real-time error detection
- Source span decorations
- AST visualization panel