import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBound from './component/ErrorHandler.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBound>
      <App />
    </ErrorBound>
  </StrictMode>
);
