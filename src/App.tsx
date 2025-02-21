import React from 'react';
import { SldEditorProvider } from './context/SldEditorContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SldEditorLayout } from './components/layout/SldEditorLayout';

const App: React.FC = () => (
  <SldEditorProvider>
    <ErrorBoundary>
      <SldEditorLayout />
    </ErrorBoundary>
  </SldEditorProvider>
);

export default App;