const CACHE_NAME = 'love-story-hindi-v3'; // जब भी आप कोड बदलें, तो इसे 'v1' से 'v2', 'v3' आदि में बदलें
const urlsToCache = [
  './love_story_hindi.html', // आपकी मुख्य HTML फ़ाइल
  './', // ऐप का रूट URL
  'https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;700&display=swap', // गूगल फॉन्ट CSS
  'https://fonts.gstatic.com/s/notoserifdevanagari/v17/KFOlCnGPuN0hbxq9o9HT0E4wENY.woff2', // Noto Serif Devanagari font (यह URL बदल सकता है, ब्राउज़र के नेटवर्क टैब में जांचें)
  './images/icon-192x192.png', // आपका आइकन
  './images/icon-512x512.png'  // आपका आइकन
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Cache addAll failed:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[Service Worker] Fetching from cache:', event.request.url);
          return response;
        }
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request);
      })
      .catch(error => {
        console.error('[Service Worker] Fetch failed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // ताकि सर्विस वर्कर तुरंत नियंत्रण ले सके
  );
});