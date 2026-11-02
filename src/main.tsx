import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Tactical PWA Service Worker for offline field resilience
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Tactical SW registration notice:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
