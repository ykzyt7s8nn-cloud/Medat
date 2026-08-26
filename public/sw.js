/*
 * Service Worker - MedAT KFF Trainer
 *
 * Strategie:
 *   - Navigationsanfragen: network-first mit Fallback auf die gecachte App-Shell
 *     (damit ein Update sofort greift, die App aber offline startet).
 *   - Statische Assets (JS/CSS/Bilder/Fonts): stale-while-revalidate.
 *   - Alles andere (fremde Origins): unangetastet durchreichen.
 *
 * Die App laedt keine externen Ressourcen, daher genuegt dieser schlanke SW,
 * um vollstaendige Offline-Faehigkeit herzustellen.
 */

const VERSION = 'kff-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;

// Relativ zur Position des Service Workers – so funktioniert die App auch
// unter einem Unterpfad (z. B. https://user.github.io/Medat/).
const SHELL_URLS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png'];

/**
 * Beim Installieren wird die vom Build erzeugte Dateiliste geladen und komplett
 * gecacht (inklusive der Lazy-Bundles der Untertests). Schlägt das fehl, wird
 * zumindest die App-Shell abgelegt.
 */
async function precache() {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(new URL('precache.json', self.location), { cache: 'no-cache' });
    if (!response.ok) throw new Error('precache.json nicht erreichbar');
    const urls = await response.json();
    await cache.addAll(urls);
  } catch {
    await cache.addAll(SHELL_URLS).catch(() => {});
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().finally(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html').then((hit) => hit || caches.match('./'))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
