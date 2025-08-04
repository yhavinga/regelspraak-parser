import { useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { AppLayout } from './components/layout/AppLayout';
import { MonacoEditor, MonacoEditorHandle } from './components/editor/MonacoEditor';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const editorRef = useRef<MonacoEditorHandle>(null);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Theme appearance="light" accentColor="blue">
        <AppLayout editorRef={editorRef}>
          <MonacoEditor ref={editorRef} />
        </AppLayout>
      </Theme>
    </QueryClientProvider>
  );
}

export default App;