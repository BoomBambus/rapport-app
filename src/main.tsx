import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource/source-sans-3/latin-400.css';
import '@fontsource/source-sans-3/latin-400-italic.css';
import '@fontsource/source-sans-3/latin-600.css';
import '@fontsource/source-sans-3/latin-700.css';
import '@fontsource/source-sans-3/latin-900.css';
import './styles/colors.css';
import './styles/typography.css';
import './styles/spacing.css';
import './styles/base.css';
import './styles/app.css';
import App from './App';

registerSW({
  immediate: true,
  // Alle Dateien liegen auf dem Gerät → App meldet „offline bereit“
  onOfflineReady: () => window.dispatchEvent(new Event('offline-bereit')),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
