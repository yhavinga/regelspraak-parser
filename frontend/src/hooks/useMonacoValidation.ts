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
  
  console.log('useMonacoValidation - parseResult:', parseResult);
  
  // Convert parse errors to Monaco markers
  const updateMarkers = useCallback(() => {
    if (!editor || !monaco) return;
    
    const model = editor.getModel();
    if (!model) return;
    
    const markers: monaco.editor.IMarkerData[] = [];
    
    if (parseResult?.errors) {
      console.log('Parse result errors:', parseResult.errors);
      parseResult.errors.forEach(error => {
        if (error.span) {
          const marker = {
            severity: error.severity === 'error' 
              ? monaco.MarkerSeverity.Error 
              : monaco.MarkerSeverity.Warning,
            message: error.message,
            startLineNumber: error.span.start?.line || 1,
            startColumn: (error.span.start?.column || 0) + 1,
            endLineNumber: error.span.end?.line || 1,
            endColumn: (error.span.end?.column || 0) + 1
          };
          console.log('Adding marker with span:', marker);
          markers.push(marker);
        } else if (error.line) {
          // Fallback for simple line/column format
          const marker = {
            severity: error.severity === 'error' 
              ? monaco.MarkerSeverity.Error 
              : monaco.MarkerSeverity.Warning,
            message: error.message,
            startLineNumber: error.line,
            startColumn: error.column || 1,
            endLineNumber: error.line,
            endColumn: (error.column || 1) + 1
          };
          console.log('Adding marker with line/column:', marker);
          markers.push(marker);
        } else {
          console.log('Error has no span or line info:', error);
        }
      });
    }
    
    console.log('Setting Monaco markers:', markers);
    monaco.editor.setModelMarkers(model, 'regelspraak', markers);
  }, [editor, parseResult]);
  
  // Update decorations for inline errors (currently disabled - using markers instead)
  const updateDecorations = useCallback(() => {
    // Monaco markers already provide squiggles, so we don't need custom decorations
    return;
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