import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import Editor, { Monaco } from '@monaco-editor/react';
import { registerRegelSpraakLanguage } from '../../lib/monaco/regelspraak-language';
import { registerRegelSpraakTheme } from '../../lib/monaco/regelspraak-theme';
import { useEditorStore } from '../../stores/editor-store';
import { useMonacoValidation } from '../../hooks/useMonacoValidation';

export function MonacoEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { code, setCode } = useEditorStore();
  
  // Real-time validation
  const { parseResult, isValidating } = useMonacoValidation(
    isEditorReady ? editorRef.current : null,
    code
  );
  
  const handleEditorWillMount = (monaco: Monaco) => {
    // Register language and theme before editor mounts
    registerRegelSpraakLanguage();
    registerRegelSpraakTheme();
    
    // Add custom CSS for error decorations
    const style = document.createElement('style');
    style.innerHTML = `
      .squiggly-error {
        text-decoration: underline wavy red;
        text-decoration-skip-ink: none;
      }
    `;
    document.head.appendChild(style);
  };
  
  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    
    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      wrappingIndent: 'indent',
      automaticLayout: true
    });
    
    // Set up auto-save
    editor.onDidChangeModelContent(() => {
      setCode(editor.getValue());
    });
  };
  
  return (
    <div className="h-full w-full relative">
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
      {isValidating && (
        <div className="absolute top-2 right-2 text-xs text-gray-500">
          Validating...
        </div>
      )}
    </div>
  );
}