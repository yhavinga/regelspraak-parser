import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as monaco from 'monaco-editor';
import Editor, { Monaco } from '@monaco-editor/react';
import { registerRegelSpraakLanguage } from '../../lib/monaco/regelspraak-language';
import { registerRegelSpraakTheme } from '../../lib/monaco/regelspraak-theme';
import { useEditorStore } from '../../stores/editor-store';
import { useMonacoValidation } from '../../hooks/useMonacoValidation';

export interface MonacoEditorHandle {
  jumpToLine: (line: number) => void;
  getCurrentPosition: () => { line: number; column: number } | null;
  insertText: (text: string) => void;
  replaceTextAtLine: (line: number, find: string, replace: string) => void;
}

export const MonacoEditor = forwardRef<MonacoEditorHandle>((props, ref) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { code, setCode } = useEditorStore();
  
  // Real-time validation
  const { parseResult, isValidating } = useMonacoValidation(
    isEditorReady ? editorRef.current : null,
    code
  );
  
  useImperativeHandle(ref, () => ({
    jumpToLine: (line: number) => {
      const editor = editorRef.current;
      if (!editor) return;
      
      // Reveal line in center
      editor.revealLineInCenter(line);
      
      // Set cursor position
      editor.setPosition({ lineNumber: line, column: 1 });
      
      // Focus editor
      editor.focus();
      
      // Highlight line temporarily
      const decoration = editor.deltaDecorations([], [{
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: 'error-line-highlight',
          glyphMarginClassName: 'error-glyph'
        }
      }]);
      
      // Remove highlight after 2 seconds
      setTimeout(() => {
        editor.deltaDecorations(decoration, []);
      }, 2000);
    },
    
    getCurrentPosition: () => {
      const position = editorRef.current?.getPosition();
      return position ? { line: position.lineNumber, column: position.column } : null;
    },
    
    insertText: (text: string) => {
      const editor = editorRef.current;
      if (!editor) return;
      
      const position = editor.getPosition();
      if (position) {
        editor.executeEdits('quick-fix', [{
          range: new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          ),
          text: text
        }]);
      }
    },
    
    replaceTextAtLine: (line: number, find: string, replace: string) => {
      const editor = editorRef.current;
      if (!editor) return;
      
      const model = editor.getModel();
      if (!model) return;
      
      const lineContent = model.getLineContent(line);
      const newContent = lineContent.replace(find, replace);
      
      const fullRange = new monaco.Range(line, 1, line, lineContent.length + 1);
      editor.executeEdits('quick-fix', [{
        range: fullRange,
        text: newContent
      }]);
    }
  }), []);
  
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
      .error-line-highlight {
        background-color: rgba(255, 0, 0, 0.1);
        animation: pulse 2s ease-out;
      }
      .error-glyph {
        background-color: #ff0000;
        width: 4px !important;
        margin-left: 3px;
      }
      @keyframes pulse {
        0% { background-color: rgba(255, 0, 0, 0.3); }
        100% { background-color: rgba(255, 0, 0, 0.1); }
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
  
  // Update editor value when code changes from external sources (e.g., example dropdown)
  useEffect(() => {
    if (editorRef.current && code !== editorRef.current.getValue()) {
      editorRef.current.setValue(code);
    }
  }, [code]);
  
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
});