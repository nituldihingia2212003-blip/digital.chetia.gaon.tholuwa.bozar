// চেতিয়া গাঁও থলুৱা বজাৰ - অফলাইন চাৰ্ভিচ ৱৰ্কাৰ
const CACHE_NAME = 'chetia-bajar-offline-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// ইনষ্টল হোৱাৰ লগে লগে সকলো ফাইল মোবাইলৰ মেম'ৰীত সংৰক্ষণ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// পুৰণি কেচ পৰিষ্কাৰ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// নেট নাথাকিলেও মোবাইল মেম'ৰীৰ পৰা এপটো তৎক্ষণাত খোল খাব
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // কেচৰ পৰা ফাইল দিলে আৰু নেট থাকিলে বেকগ্ৰাউণ্ডত আপডেট হ'ব
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});
