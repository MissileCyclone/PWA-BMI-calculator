const staticCacheName = 'site-static-v1';
const assets = [
  './index.html',
  './images/logo.png',
  './images/icons/icon-128x128.png',
  './images/icons/icon-192x192.png',
  './images/icons/icon-72x72.png',
  './images/icons/icon-96x96.png',
  './images/icons/icon-144x144.png',
  './images/icons/icon-152x152.png',
  './images/icons/icon-384x384.png',
  './images/icons/icon-512x512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('Кэширование ресурсов');
      return Promise.all(assets.map(asset => {
        return fetch(asset).then(response => {
          if (!response.ok) {
            throw new Error(`Ошибка загрузки ресурса: ${asset}`);
          }
          return cache.add(asset);
        }).catch(err => {
          console.error('Ошибка кэширования:', err);
        });
      }));
    })
  );
});

// Событие активации (activate event)
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== staticCacheName).map(key => caches.delete(key))
      );
    })
  );
});

// Событие fetch для оффлайн режима
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});