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