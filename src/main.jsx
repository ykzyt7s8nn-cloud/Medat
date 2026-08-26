import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Service Worker für Offline-Betrieb registrieren (nur im Produktionsbuild,
// damit der Dev-Server nicht von einem Cache ausgebremst wird).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // document.baseURI zeigt auf die Seite selbst, nicht auf den Assets-Ordner –
    // dadurch wird der Service Worker auch unter einem Unterpfad gefunden.
    navigator.serviceWorker.register(new URL('sw.js', document.baseURI)).catch(() => {
      // Offline-Funktion ist ein Zusatz – ein Fehler darf die App nicht stören.
    });
  });
}
