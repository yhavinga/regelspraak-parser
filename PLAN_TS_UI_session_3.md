# RegelSpraak UI Session 3: Guided Mode Interface

**Goal**: Build a form-based interface for beginners to create RegelSpraak rules without writing code.

**Duration**: 4-6 hours

**Prerequisites**: Completed Sessions 1-2, parser integration working

## Deliverables

1. Mode switcher (Expert/Guided)
2. Object type builder form
3. Rule builder with smart dropdowns
4. Live code preview synchronized with form
5. Template library for common patterns

## Implementation Steps

### 1. Update Editor Store for Modes (30 min)

Update `src/stores/editor-store.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type EditorMode = 'expert' | 'guided';

interface GuidedModeState {
  activeConstruct: 'objectType' | 'rule' | 'parameter' | 'decisionTable';
  currentFormData: any;
}

interface EditorState {
  code: string;
  fileName: string;
  isDirty: boolean;
  mode: EditorMode;
  guidedState: GuidedModeState;
  
  setCode: (code: string) => void;
  setFileName: (name: string) => void;
  markClean: () => void;
  setMode: (mode: EditorMode) => void;
  updateGuidedState: (state: Partial<GuidedModeState>) => void;
  appendCode: (newCode: string) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      code: DEFAULT_CODE,
      fileName: 'untitled.rs',
      isDirty: false,
      mode: 'expert',
      guidedState: {
        activeConstruct: 'rule',
        currentFormData: {}
      },
      
      setCode: (code) =>
        set((state) => ({
          code,
          isDirty: state.code !== code
        })),
        
      setFileName: (fileName) => set({ fileName }),
      
      markClean: () => set({ isDirty: false }),
      
      setMode: (mode) => set({ mode }),
      
      updateGuidedState: (guidedState) =>
        set((state) => ({
          guidedState: { ...state.guidedState, ...guidedState }
        })),
        
      appendCode: (newCode) =>
        set((state) => ({
          code: state.code + '\n\n' + newCode,
          isDirty: true
        }))
    }),
    {
      name: 'regelspraak-editor'
    }
  )
);
```

### 2. Mode Switcher Component (30 min)

Create `src/components/editor/ModeSwitcher.tsx`:

```typescript
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
import { CodeIcon, ComponentIcon } from '@radix-ui/react-icons';
import { useEditorStore } from '../../stores/editor-store';

export function ModeSwitcher() {
  const { mode, setMode } = useEditorStore();
  
  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
      <span className="text-sm text-gray-600">Mode:</span>
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(value) => value && setMode(value as any)}
        className="flex space-x-1"
      >
        <ToggleGroupItem
          value="guided"
          className="flex items-center space-x-1 px-3 py-1 rounded data-[state=on]:bg-white data-[state=on]:shadow-sm"
        >
          <ComponentIcon />
          <span className="text-sm">Guided</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="expert"
          className="flex items-center space-x-1 px-3 py-1 rounded data-[state=on]:bg-white data-[state=on]:shadow-sm"
        >
          <CodeIcon />
          <span className="text-sm">Expert</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
```

### 3. Guided Mode Container (45 min)

Create `src/components/guided/GuidedModeContainer.tsx`:

```typescript
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useEditorStore } from '../../stores/editor-store';
import { RuleBuilder } from './RuleBuilder';
import { ObjectTypeBuilder } from './ObjectTypeBuilder';
import { ParameterBuilder } from './ParameterBuilder';
import { TemplateLibrary } from './TemplateLibrary';
import { LivePreview } from './LivePreview';

export function GuidedModeContainer() {
  const { guidedState, updateGuidedState } = useEditorStore();
  const [showPreview, setShowPreview] = useState(true);
  
  return (
    <div className="h-full flex">
      <div className="flex-1 overflow-auto bg-white">
        <Tabs
          value={guidedState.activeConstruct}
          onValueChange={(value) => 
            updateGuidedState({ activeConstruct: value as any })
          }
          className="h-full flex flex-col"
        >
          <div className="border-b border-gray-200 px-4">
            <TabsList className="flex space-x-4">
              <TabsTrigger value="rule" className="py-2 px-1 border-b-2 border-transparent data-[state=active]:border-blue-500">
                Nieuwe Regel
              </TabsTrigger>
              <TabsTrigger value="objectType" className="py-2 px-1 border-b-2 border-transparent data-[state=active]:border-blue-500">
                Object Type
              </TabsTrigger>
              <TabsTrigger value="parameter" className="py-2 px-1 border-b-2 border-transparent data-[state=active]:border-blue-500">
                Parameter
              </TabsTrigger>
              <TabsTrigger value="templates" className="py-2 px-1 border-b-2 border-transparent data-[state=active]:border-blue-500">
                Templates
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <TabsContent value="rule" className="h-full">
              <RuleBuilder />
            </TabsContent>
            <TabsContent value="objectType" className="h-full">
              <ObjectTypeBuilder />
            </TabsContent>
            <TabsContent value="parameter" className="h-full">
              <ParameterBuilder />
            </TabsContent>
            <TabsContent value="templates" className="h-full">
              <TemplateLibrary />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {showPreview && (
        <div className="w-96 border-l border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="font-medium text-sm">Live Preview</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <LivePreview />
        </div>
      )}
    </div>
  );
}
```

### 4. Rule Builder Component (1.5 hours)

Create `src/components/guided/RuleBuilder.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { parserService } from '../../services/parser-service';
import { useEditorStore } from '../../stores/editor-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';

interface RuleFormData {
  name: string;
  scope: 'altijd' | 'voorAlle' | 'voorSpecifiek';
  objectType: string;
  targetAttribute: string;
  targetKenmerk: string;
  actionType: 'toekennen' | 'berekenen' | 'kenmerk';
  expression: string;
  hasCondition: boolean;
  conditionLeft: string;
  conditionOperator: string;
  conditionRight: string;
}

export function RuleBuilder() {
  const { code, appendCode } = useEditorStore();
  const [formData, setFormData] = useState<RuleFormData>({
    name: '',
    scope: 'altijd',
    objectType: '',
    targetAttribute: '',
    targetKenmerk: '',
    actionType: 'kenmerk',
    expression: '',
    hasCondition: false,
    conditionLeft: '',
    conditionOperator: 'groter dan',
    conditionRight: ''
  });
  
  // Parse current code to get available types
  const { data: parseResult } = useQuery({
    queryKey: ['parse-for-guided', code],
    queryFn: () => parserService.parse(code),
    enabled: !!code
  });
  
  const objectTypes = Array.from(parseResult?.model?.objectTypes.keys() || []);
  
  const getAttributesForType = (typeName: string) => {
    const objectType = parseResult?.model?.objectTypes.get(typeName);
    return objectType?.attributes.map(a => a.name) || [];
  };
  
  const getKenmerkenForType = (typeName: string) => {
    const objectType = parseResult?.model?.objectTypes.get(typeName);
    return objectType?.kenmerken.map(k => k.name) || [];
  };
  
  const generateRegelSpraak = (): string => {
    const { 
      name, scope, objectType, targetAttribute, targetKenmerk,
      actionType, expression, hasCondition,
      conditionLeft, conditionOperator, conditionRight 
    } = formData;
    
    if (!name || !objectType) return '';
    
    let regel = `Regel ${name}\n`;
    
    // Scope
    if (scope === 'altijd') {
      regel += '    geldig altijd\n';
    } else if (scope === 'voorAlle') {
      regel += `    geldig voor alle ${objectType}\n`;
    }
    
    // Action
    regel += '        ';
    if (scope === 'voorAlle' || scope === 'voorSpecifiek') {
      regel += `Een ${objectType} `;
    } else {
      regel += `De ${targetAttribute || targetKenmerk} van een ${objectType} `;
    }
    
    if (actionType === 'kenmerk' && targetKenmerk) {
      regel += `is ${targetKenmerk}`;
    } else if (actionType === 'berekenen' && targetAttribute) {
      regel += `moet berekend worden als ${expression}`;
    } else if (actionType === 'toekennen' && targetAttribute) {
      regel += `moet gesteld worden op ${expression}`;
    }
    
    // Condition
    if (hasCondition && conditionLeft) {
      regel += `\n        indien ${conditionLeft} ${conditionOperator} ${conditionRight}`;
    }
    
    regel += '.';
    
    return regel;
  };
  
  const handleSubmit = () => {
    const regelCode = generateRegelSpraak();
    if (regelCode) {
      appendCode(regelCode);
      // Reset form
      setFormData({
        ...formData,
        name: '',
        expression: '',
        conditionLeft: '',
        conditionRight: ''
      });
    }
  };
  
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Nieuwe Regel Maken</h2>
        
        {/* Rule Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Regel naam</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="bijv. Minderjarigheid check"
          />
        </div>
        
        {/* Scope */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Wanneer is deze regel van toepassing?</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="altijd"
                checked={formData.scope === 'altijd'}
                onChange={(e) => setFormData({ ...formData, scope: 'altijd' })}
                className="mr-2"
              />
              Altijd
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="voorAlle"
                checked={formData.scope === 'voorAlle'}
                onChange={(e) => setFormData({ ...formData, scope: 'voorAlle' })}
                className="mr-2"
              />
              Voor alle
              {formData.scope === 'voorAlle' && (
                <select
                  value={formData.objectType}
                  onChange={(e) => setFormData({ ...formData, objectType: e.target.value })}
                  className="ml-2 px-2 py-1 border rounded"
                >
                  <option value="">Kies type...</option>
                  {objectTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              )}
            </label>
          </div>
        </div>
        
        {/* Object Type (if scope is altijd) */}
        {formData.scope === 'altijd' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Object type</label>
            <select
              value={formData.objectType}
              onChange={(e) => setFormData({ ...formData, objectType: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Kies een object type...</option>
              {objectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Action Type */}
        {formData.objectType && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Wat moet er gebeuren?</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="kenmerk"
                  checked={formData.actionType === 'kenmerk'}
                  onChange={() => setFormData({ ...formData, actionType: 'kenmerk' })}
                  className="mr-2"
                />
                Kenmerk toekennen
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="berekenen"
                  checked={formData.actionType === 'berekenen'}
                  onChange={() => setFormData({ ...formData, actionType: 'berekenen' })}
                  className="mr-2"
                />
                Waarde berekenen
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="toekennen"
                  checked={formData.actionType === 'toekennen'}
                  onChange={() => setFormData({ ...formData, actionType: 'toekennen' })}
                  className="mr-2"
                />
                Waarde toekennen
              </label>
            </div>
          </div>
        )}
        
        {/* Target Selection */}
        {formData.objectType && formData.actionType === 'kenmerk' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Welk kenmerk?</label>
            <select
              value={formData.targetKenmerk}
              onChange={(e) => setFormData({ ...formData, targetKenmerk: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Kies een kenmerk...</option>
              {getKenmerkenForType(formData.objectType).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        )}
        
        {formData.objectType && (formData.actionType === 'berekenen' || formData.actionType === 'toekennen') && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Welk attribuut?</label>
              <select
                value={formData.targetAttribute}
                onChange={(e) => setFormData({ ...formData, targetAttribute: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Kies een attribuut...</option>
                {getAttributesForType(formData.objectType).map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {formData.actionType === 'berekenen' ? 'Bereken als:' : 'Stel in op:'}
              </label>
              <input
                type="text"
                value={formData.expression}
                onChange={(e) => setFormData({ ...formData, expression: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="bijv. 100 EUR of de leeftijd plus 5"
              />
            </div>
          </>
        )}
        
        {/* Condition */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.hasCondition}
              onChange={(e) => setFormData({ ...formData, hasCondition: e.target.checked })}
              className="mr-2"
            />
            Voeg voorwaarde toe
          </label>
        </div>
        
        {formData.hasCondition && (
          <div className="ml-6 space-y-2 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-2">
              <span className="text-sm">indien</span>
              <input
                type="text"
                value={formData.conditionLeft}
                onChange={(e) => setFormData({ ...formData, conditionLeft: e.target.value })}
                className="flex-1 px-2 py-1 border rounded"
                placeholder="bijv. zijn leeftijd"
              />
              <select
                value={formData.conditionOperator}
                onChange={(e) => setFormData({ ...formData, conditionOperator: e.target.value })}
                className="px-2 py-1 border rounded"
              >
                <option value="groter dan">groter dan</option>
                <option value="groter of gelijk aan">groter of gelijk aan</option>
                <option value="kleiner dan">kleiner dan</option>
                <option value="kleiner of gelijk aan">kleiner of gelijk aan</option>
                <option value="gelijk aan">gelijk aan</option>
                <option value="ongelijk aan">ongelijk aan</option>
              </select>
              <input
                type="text"
                value={formData.conditionRight}
                onChange={(e) => setFormData({ ...formData, conditionRight: e.target.value })}
                className="flex-1 px-2 py-1 border rounded"
                placeholder="bijv. 18"
              />
            </div>
          </div>
        )}
        
        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.objectType}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            Regel Toevoegen
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 5. Live Preview Component (30 min)

Create `src/components/guided/LivePreview.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useEditorStore } from '../../stores/editor-store';

// Custom RegelSpraak syntax highlighting
const regelspraakLanguage = {
  'keyword': /\b(Regel|Objecttype|Parameter|geldig|altijd|indien|moet|worden|als|is|van|de|het|een)\b/,
  'string': /"[^"]*"/,
  'number': /\b\d+(\.\d+)?\s*(jr|km|EUR|%)?\b/,
  'operator': /\b(plus|min|maal|gedeeld door|groter dan|kleiner dan|gelijk aan)\b/,
  'punctuation': /[.,;]/
};

export function LivePreview() {
  const { guidedState } = useEditorStore();
  const [previewCode, setPreviewCode] = useState('');
  
  useEffect(() => {
    // This would be populated by the active form
    // For now, we'll show a placeholder
    setPreviewCode(`# Live preview wordt hier getoond
# terwijl u het formulier invult

Regel ${guidedState.currentFormData?.name || 'Nieuwe Regel'}
    geldig altijd
        # Uw regel komt hier...`);
  }, [guidedState]);
  
  return (
    <div className="h-full overflow-auto p-4">
      <SyntaxHighlighter
        language="javascript"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          fontSize: '14px',
          backgroundColor: 'transparent'
        }}
      >
        {previewCode}
      </SyntaxHighlighter>
    </div>
  );
}
```

### 6. Template Library Component (45 min)

Create `src/components/guided/TemplateLibrary.tsx`:

```typescript
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useEditorStore } from '../../stores/editor-store';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'basis' | 'berekening' | 'voorwaarden' | 'geavanceerd';
  code: string;
  tags: string[];
}

const templates: Template[] = [
  {
    id: 'minderjarig',
    name: 'Minderjarigheid Check',
    description: 'Bepaal of een persoon minderjarig is op basis van leeftijd',
    category: 'basis',
    tags: ['leeftijd', 'kenmerk', 'persoon'],
    code: `Objecttype de Persoon
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    is minderjarig kenmerk;

Parameter de meerderjarigheidsleeftijd : Numeriek (geheel getal) met eenheid jr;

Regel Minderjarigheid bepalen
    geldig voor alle Persoon
        Een Persoon is minderjarig
        indien zijn leeftijd kleiner is dan de meerderjarigheidsleeftijd.`
  },
  {
    id: 'belasting',
    name: 'Belasting Berekening',
    description: 'Bereken belasting op basis van inkomen met staffels',
    category: 'berekening',
    tags: ['belasting', 'inkomen', 'berekening', 'beslissingstabel'],
    code: `Objecttype de Persoon
    het inkomen Numeriek (getal met 2 decimalen) met eenheid EUR;
    de belasting Numeriek (getal met 2 decimalen) met eenheid EUR;

Beslistabel Belastingtarief
    geldig altijd
|   | de belasting van een Persoon moet berekend worden als | indien zijn inkomen |
|---|--------------------------------------------------------|---------------------|
| 1 | zijn inkomen maal 0.20                                | kleiner is dan 20000 EUR |
| 2 | 4000 EUR plus ((zijn inkomen min 20000 EUR) maal 0.30) | tussen 20000 EUR en 50000 EUR |
| 3 | 13000 EUR plus ((zijn inkomen min 50000 EUR) maal 0.40) | groter is dan 50000 EUR |`
  },
  {
    id: 'korting',
    name: 'Kortingsregels',
    description: 'Bepaal korting op basis van meerdere voorwaarden',
    category: 'voorwaarden',
    tags: ['korting', 'voorwaarden', 'handel'],
    code: `Objecttype de Klant
    is vaste_klant kenmerk;
    de aankoop_bedrag Numeriek (getal met 2 decimalen) met eenheid EUR;
    de korting_percentage Numeriek (geheel getal) met eenheid %;

Regel Vaste klant korting
    geldig altijd
        De korting_percentage van een Klant moet gesteld worden op 10 %
        indien hij vaste_klant is.

Regel Bulk korting
    geldig altijd
        De korting_percentage van een Klant moet gesteld worden op 15 %
        indien zijn aankoop_bedrag groter is dan 1000 EUR.`
  }
];

export function TemplateLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('alle');
  const { setCode, setMode } = useEditorStore();
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'alle' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const useTemplate = (template: Template) => {
    setCode(template.code);
    setMode('expert'); // Switch to expert mode to see the code
  };
  
  return (
    <div className="max-w-4xl">
      <h2 className="text-lg font-semibold mb-4">Template Bibliotheek</h2>
      
      {/* Search and Filter */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Zoek templates..."
            className="w-full pl-10 pr-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedCategory('alle')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedCategory === 'alle' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setSelectedCategory('basis')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedCategory === 'basis' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Basis
          </button>
          <button
            onClick={() => setSelectedCategory('berekening')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedCategory === 'berekening' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Berekeningen
          </button>
          <button
            onClick={() => setSelectedCategory('voorwaarden')}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedCategory === 'voorwaarden' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Voorwaarden
          </button>
        </div>
      </div>
      
      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => useTemplate(template)}
          >
            <h3 className="font-semibold mb-1">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            <div className="flex flex-wrap gap-1">
              {template.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 7. Object Type Builder (30 min)

Create `src/components/guided/ObjectTypeBuilder.tsx`:

```typescript
import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { useEditorStore } from '../../stores/editor-store';

interface Attribute {
  name: string;
  type: string;
  unit?: string;
}

interface Kenmerk {
  name: string;
  type: 'bijvoeglijk' | 'bezittelijk';
}

export function ObjectTypeBuilder() {
  const { appendCode } = useEditorStore();
  const [objectName, setObjectName] = useState('');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [kenmerken, setKenmerken] = useState<Kenmerk[]>([]);
  
  const addAttribute = () => {
    setAttributes([...attributes, { name: '', type: 'Tekst' }]);
  };
  
  const addKenmerk = () => {
    setKenmerken([...kenmerken, { name: '', type: 'bijvoeglijk' }]);
  };
  
  const generateCode = () => {
    if (!objectName) return;
    
    let code = `Objecttype de ${objectName}\n`;
    
    attributes.forEach(attr => {
      if (attr.name) {
        code += `    de ${attr.name} ${attr.type}`;
        if (attr.unit) {
          code += ` met eenheid ${attr.unit}`;
        }
        code += ';\n';
      }
    });
    
    kenmerken.forEach(kenmerk => {
      if (kenmerk.name) {
        if (kenmerk.type === 'bijvoeglijk') {
          code += `    is ${kenmerk.name} kenmerk;\n`;
        } else {
          code += `    ${kenmerk.name} kenmerk (bezittelijk);\n`;
        }
      }
    });
    
    appendCode(code.trim());
    
    // Reset form
    setObjectName('');
    setAttributes([]);
    setKenmerken([]);
  };
  
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold">Nieuw Object Type</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Object naam</label>
        <input
          type="text"
          value={objectName}
          onChange={(e) => setObjectName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="bijv. Persoon, Product, Factuur"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Attributen</h3>
          <button
            onClick={addAttribute}
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
          >
            <PlusIcon />
            <span className="text-sm">Attribuut toevoegen</span>
          </button>
        </div>
        
        <div className="space-y-2">
          {attributes.map((attr, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={attr.name}
                onChange={(e) => {
                  const newAttrs = [...attributes];
                  newAttrs[index].name = e.target.value;
                  setAttributes(newAttrs);
                }}
                className="flex-1 px-2 py-1 border rounded"
                placeholder="Attribuut naam"
              />
              <select
                value={attr.type}
                onChange={(e) => {
                  const newAttrs = [...attributes];
                  newAttrs[index].type = e.target.value;
                  setAttributes(newAttrs);
                }}
                className="px-2 py-1 border rounded"
              >
                <option value="Tekst">Tekst</option>
                <option value="Numeriek (geheel getal)">Numeriek (geheel getal)</option>
                <option value="Numeriek (getal met 2 decimalen)">Numeriek (decimaal)</option>
                <option value="Boolean">Boolean</option>
                <option value="Datum in dagen">Datum</option>
              </select>
              <button
                onClick={() => setAttributes(attributes.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-600"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Kenmerken</h3>
          <button
            onClick={addKenmerk}
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
          >
            <PlusIcon />
            <span className="text-sm">Kenmerk toevoegen</span>
          </button>
        </div>
        
        <div className="space-y-2">
          {kenmerken.map((kenmerk, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={kenmerk.name}
                onChange={(e) => {
                  const newKenmerken = [...kenmerken];
                  newKenmerken[index].name = e.target.value;
                  setKenmerken(newKenmerken);
                }}
                className="flex-1 px-2 py-1 border rounded"
                placeholder="Kenmerk naam"
              />
              <select
                value={kenmerk.type}
                onChange={(e) => {
                  const newKenmerken = [...kenmerken];
                  newKenmerken[index].type = e.target.value as any;
                  setKenmerken(newKenmerken);
                }}
                className="px-2 py-1 border rounded"
              >
                <option value="bijvoeglijk">Bijvoeglijk (is ...)</option>
                <option value="bezittelijk">Bezittelijk (heeft ...)</option>
              </select>
              <button
                onClick={() => setKenmerken(kenmerken.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-600"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={generateCode}
        disabled={!objectName}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
      >
        Object Type Toevoegen
      </button>
    </div>
  );
}
```

### 8. Update Main App (15 min)

Update `src/App.tsx` to support dual mode:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { AppLayout } from './components/layout/AppLayout';
import { MonacoEditor } from './components/editor/MonacoEditor';
import { GuidedModeContainer } from './components/guided/GuidedModeContainer';
import { useEditorStore } from './stores/editor-store';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const { mode } = useEditorStore();
  
  return (
    <QueryClientProvider client={queryClient}>
      <Theme appearance="light" accentColor="blue">
        <AppLayout>
          {mode === 'expert' ? <MonacoEditor /> : <GuidedModeContainer />}
        </AppLayout>
      </Theme>
    </QueryClientProvider>
  );
}

export default App;
```

Update header in `AppLayout.tsx` to include mode switcher:

```typescript
import { ModeSwitcher } from '../editor/ModeSwitcher';

// In the header section:
<div className="flex items-center space-x-4">
  <h1 className="text-xl font-semibold text-gray-800">
    RegelSpraak Editor
  </h1>
  <ModeSwitcher />
  <span className="text-sm text-gray-600">
    {fileName} {isDirty && '*'}
  </span>
</div>
```

## Testing & Verification

1. Test mode switching:
   - Click between Guided and Expert modes
   - Verify UI changes appropriately
   - Check that code persists between mode switches

2. Test Rule Builder:
   - Create a simple kenmerk rule
   - Create a calculation rule with condition
   - Verify generated code appears in expert mode

3. Test Object Type Builder:
   - Create an object with multiple attributes
   - Add kenmerken of both types
   - Verify correct RegelSpraak syntax

4. Test Template Library:
   - Search for templates
   - Filter by category
   - Click template and verify it loads in editor

5. Test Live Preview:
   - Make changes in form
   - Verify preview updates (when implemented)

## UI/UX Considerations

1. **Progressive Disclosure**: Hide complex options initially
2. **Contextual Help**: Tooltips explaining RegelSpraak concepts
3. **Validation**: Real-time feedback on form inputs
4. **Smart Defaults**: Pre-select common options
5. **Responsive**: Works on tablets (not phones)

## Next Session Preview

Session 4 will implement the REPL interface:
- Interactive console component
- Command parsing and execution
- Context management
- Special commands (evaluate, execute, load)