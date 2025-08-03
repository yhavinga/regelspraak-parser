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

// Test code with intentional errors to verify validation
const DEFAULT_CODE = `# RegelSpraak Voorbeeld

Objecttype de Persoon
    de naam Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr
    is volwassen kenmerk;

Parameter de meerderjarigheidsleeftijd : Numeriek (geheel getal) met eenheid jr;

Regel Volwassenheid bepalen
    geldig altijd
        Een OnbekendType is volwassen
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