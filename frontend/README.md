# RegelSpraak Editor Frontend

## Session 1 Complete ✓

We've successfully created a basic RegelSpraak editor with:
- React + TypeScript + Vite setup
- Monaco Editor with RegelSpraak syntax highlighting
- Basic keywords highlighted (Regel, Objecttype, Parameter, etc.)
- Numbers with units support (18 jr, 100 EUR, etc.)
- Persistent editor state using Zustand
- Clean UI with Tailwind CSS

## Running the Editor

```bash
npm install
npm run dev
```

Then open http://localhost:5173/

## Features Implemented

1. **Syntax Highlighting**
   - Keywords in blue (bold)
   - Types in teal
   - Strings in red
   - Numbers in green
   - Comments in green (italic)

2. **Editor Features**
   - Line numbers
   - Word wrap
   - Bracket pair colorization
   - Minimap
   - Auto-save to localStorage

3. **UI**
   - Clean header with file name
   - Shows dirty state (*)
   - Run button (not functional yet)

## Next Session

Session 2 will add:
- TypeScript parser integration
- Real-time error detection
- Error squiggly lines
- AST visualization

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── editor/
│   │   │   └── MonacoEditor.tsx
│   │   └── layout/
│   │       └── AppLayout.tsx
│   ├── lib/
│   │   └── monaco/
│   │       ├── regelspraak-language.ts
│   │       └── regelspraak-theme.ts
│   ├── stores/
│   │   └── editor-store.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```