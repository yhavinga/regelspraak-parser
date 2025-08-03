import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { AppLayout } from './components/layout/AppLayout';
import { MonacoEditor } from './components/editor/MonacoEditor';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme appearance="light" accentColor="blue">
        <AppLayout>
          <MonacoEditor />
        </AppLayout>
      </Theme>
    </QueryClientProvider>
  );
}

export default App;