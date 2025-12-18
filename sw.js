const CACHE_NAME = 'tobe-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

// Logic for Automated Reports at 10 PM and Sunday Morning
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'daily-report') {
        event.waitUntil(sendReportNotification("Daily Summary", "Check your 10 PM performance report."));
    }
});

async function sendReportNotification(title, body) {
    return self.registration.showNotification(title, {
        body: body,
        icon: '/logo.svg'
    });
}
