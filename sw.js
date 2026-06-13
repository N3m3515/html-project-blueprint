// Service Worker — Baustein „PWA / Offline"
// PFLEGE: CACHE-Version erhöhen nach jeder Inhaltsänderung (z. B. 'bp-v2') → zwingt alle Clients zum Update.
// PFLEGE: PRECACHE-Liste aktualisieren wenn neue .html-Seiten hinzukommen.
const CACHE = 'bp-v10';
const PRECACHE = [
  'index.html',
  'detail.html',
  'search-index.js',
  'manifest.json',
  'icon.svg'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE.map(p => new Request(p, {cache: 'reload'}))))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-First mit Netz-Fallback; dynamisch geladene Ressourcen werden im Cache ergänzt.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return; // nur same-origin
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      });
    })
  );
});
