import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initTheme } from './theme/storage';
import './index.css';

// Set data-theme BEFORE the first React paint so there is no flash of the wrong theme.
initTheme();

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
