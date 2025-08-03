import { useEffect, useRef, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { useQuery } from '@tanstack/react-query';
import { parserService } from '../services/real-parser-service';
import { useDebounce } from './useDebounce';

export function useMonacoValidation(
  editor: monaco.editor.IStandaloneCodeEditor | null,
  code: string
) {
  const decorationsRef = useRef<string[]>([]);
  const debouncedCode = useDebounce(code, 300); // 300ms debounce
  
  // Parse query
  const { data: parseResult } = useQuery({
    queryKey: ['parse', debouncedCode],
    queryFn: () => parserService.validate(debouncedCode),
    enabled: !!debouncedCode && !!editor,
    staleTime: 60000, // Cache for 1 minute
    gcTime: 300000 // Keep in cache for 5 minutes
  });
  
  // Convert parse errors to Monaco markers
  const updateMarkers = useCallback(() => {
    if (!editor || !monaco) return;
    
    const model = editor.getModel();
    if (!model) return;
    
    const markers: monaco.editor.IMarkerData[] = [];
    
    if (parseResult?.errors) {
      parseResult.errors.forEach(error => {
        if (error.span) {
          markers.push({
            severity: error.severity === 'error' 
              ? monaco.MarkerSeverity.Error 
              : monaco.MarkerSeverity.Warning,
            message: error.message,
            startLineNumber: error.span.start?.line || 1,
            startColumn: (error.span.start?.column || 0) + 1,
            endLineNumber: error.span.end?.line || 1,
            endColumn: (error.span.end?.column || 0) + 1
          });
        } else if (error.line) {
          // Fallback for simple line/column format
          markers.push({
            severity: error.severity === 'error' 
              ? monaco.MarkerSeverity.Error 
              : monaco.MarkerSeverity.Warning,
            message: error.message,
            startLineNumber: error.line,
            startColumn: error.column || 1,
            endLineNumber: error.line,
            endColumn: (error.column || 1) + 1
          });
        }
      });
    }
    
    monaco.editor.setModelMarkers(model, 'regelspraak', markers);
  }, [editor, parseResult]);
  
  // Update decorations for inline errors
  const updateDecorations = useCallback(() => {
    if (!editor || !parseResult) return;
    
    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];
    
    parseResult.errors.forEach(error => {
      if (error.span && error.severity === 'error') {
        newDecorations.push({
          range: new monaco.Range(
            error.span.start.line,
            error.span.start.column + 1,
            error.span.end.line,
            error.span.end.column + 1
          ),
          options: {
            inlineClassName: 'squiggly-error',
            hoverMessage: { value: error.message },
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
          }
        });
      }
    });
    
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [editor, parseResult]);
  
  // Apply markers and decorations
  useEffect(() => {
    updateMarkers();
    updateDecorations();
  }, [updateMarkers, updateDecorations]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor && decorationsRef.current.length > 0) {
        editor.deltaDecorations(decorationsRef.current, []);
      }
    };
  }, [editor]);
  
  return {
    parseResult,
    isValidating: !parseResult && !!debouncedCode
  };
}