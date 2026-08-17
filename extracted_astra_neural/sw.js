
const CACHE_NAME = 'astra-os-v2-core';
const DYNAMIC_CACHE = 'astra-os-v2-dynamic';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  // Add other static assets here if built
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
          return caches.delete(key);
        }
      })
    ))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Stale-While-Revalidate Strategy
  event.respondWith(
    caches.open(DYNAMIC_CACHE).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
             cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
             // Fallback logic could go here
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});
