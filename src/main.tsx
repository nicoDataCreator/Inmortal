import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and suppress benign Vite/HMR WebSocket connection errors inside the sandbox environment
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const errorMsg = event.reason?.message || String(event.reason || '');
    if (errorMsg.includes('WebSocket') || errorMsg.includes('vite') || errorMsg.includes('websocket')) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    const errorMsg = event.message || '';
    if (errorMsg.includes('WebSocket') || errorMsg.includes('vite') || errorMsg.includes('websocket')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

