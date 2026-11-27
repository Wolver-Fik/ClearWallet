/* ClearWallet service worker — Network-First for HTML, cache-first for assets */
'use strict';

/* Cada cambio de version purga solo CacheStorage; IndexedDB
   (clearwallet_db) y localStorage nunca se borran aqui. */
const CACHE = 'clearwallet-v1.6.6';
const PRECACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/i18n/en.js',
  './js/i18n/es.js',
  './js/i18n/pt.js',
  './js/i18n/fr.js',
  './js/i18n/it.js',
  './js/i18n/de.js',
  './js/i18n/ru.js',
  './js/i18n/ja.js',
  './js/storage.js',
  './js/ios-install.js',
  './js/app.js',
  './icons/icon.svg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('clearwallet-') && key !== CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (data === 'SKIP_WAITING' || (data && data.type === 'SKIP_WAITING')) {
    event.waitUntil(self.skipWaiting());
  }
});

/* Las escrituras en cache se registran con waitUntil DENTRO del manejador
   del evento (antes de cualquier await); si se hicieran despues, el navegador
   podria terminar el worker y dejar la respuesta sin guardar. */
function trackCacheWrite(event, promise) {
  if (!promise) return;
  const tracked = Promise.resolve(promise).catch(() => undefined);
  if (event && typeof event.waitUntil === 'function') event.waitUntil(tracked);
  return tracked;
}

function networkFirst(request, event) {
  const cacheP = caches.open(CACHE);
  const networkP = fetch(request);
  trackCacheWrite(event, networkP.then((response) => {
    if (!response || !response.ok) return null;
    return cacheP.then((cache) => cache.put(request, response.clone()));
  }));
  return networkP.then((response) => response, () =>
    cacheP.then((cache) => cache.match(request))
      .then((cached) => cached || cache.match('./index.html'))
      .then((fallback) => fallback || new Response('Offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }))
  );
}

function cacheFirst(request, event) {
  const cacheP = caches.open(CACHE);
  const cachedP = cacheP.then((cache) => cache.match(request));
  const networkP = cachedP.then((cached) => cached ? null : fetch(request));
  trackCacheWrite(event, networkP.then((response) => {
    if (!response || !response.ok) return null;
    return cacheP.then((cache) => cache.put(request, response.clone()));
  }));
  return cachedP.then((cached) => cached || networkP)
    .catch(() => new Response('', { status: 504 }));
}

function staleWhileRevalidate(request, event) {
  const cacheP = caches.open(CACHE);
  const cachedP = cacheP.then((cache) => cache.match(request));
  const networkP = fetch(request).catch(() => null);
  trackCacheWrite(event, networkP.then((response) => {
    if (!response || !(response.ok || response.type === 'opaque')) return null;
    return cacheP.then((cache) => cache.put(request, response.clone()));
  }));
  return cachedP.then((cached) => cached || networkP)
    .then((response) => response || new Response('', { status: 504 }));
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try { url = new URL(request.url); } catch (error) { return; }

  const sameOrigin = url.origin === self.location.origin;
  const isHTML = request.mode === 'navigate' ||
    request.destination === 'document' ||
    (sameOrigin && (url.pathname.endsWith('/') || /\.html?$/.test(url.pathname)));

  if (isHTML) {
    event.respondWith(networkFirst(request, event));
  } else if (sameOrigin) {
    event.respondWith(cacheFirst(request, event));
  } else {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});
