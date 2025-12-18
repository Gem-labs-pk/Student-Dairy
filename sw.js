const CACHE_NAME = 'tobe-v3-final';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.svg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Network-first for firebase, cache-first for static assets
  if (e.request.url.includes('firebase')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      })
    );
  }
});
