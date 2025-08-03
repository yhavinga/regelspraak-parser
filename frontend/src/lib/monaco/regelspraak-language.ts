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