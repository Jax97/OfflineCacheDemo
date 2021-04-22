let cacheFiles = ['./test.js', './test.html', './baidu.png', './favicon.ico'];

let __version__ = 'cache-v4';

// 文件缓存
self.addEventListener('install', (e) => {
  // 强制更新service worker
  self.skipWaiting();
  e.waitUntil(
    caches.open(__version__).then((cache) => {
      return cache.addAll(cacheFiles);
    })
  );
  console.log('skipWaiting');
});

// console.log('self: ', self);

// 缓存更新
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== __version__) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 请求代理
// self.addEventListener('fetch', function (event) {
//   console.log('handling fetch event for: ', event.request.url);
//   if (event.request.url.match('sockjs')) return;
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       if (response) {
//         console.log('Found response in cache: ', response);
//         return response;
//       }
//       return fetch(event.request)
//         .then(function (response) {
//           console.log('Response from network is: ', response);
//           caches.open(__version__).then(function (cache) {
//             cache.put(event.request, response);
//             return response;
//           });
//         })
//         .catch(function (err) {
//           console.error('Fetching faild: ', err);
//           throw err;
//         });
//     })
//   );
// });

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async function () {
      let networkResponsePromise, cachedResponse;
      try {
        networkResponsePromise = await fetch(event.request);
        const cache = await caches.open(__version__);
        cache.put(event.request, networkResponsePromise.clone());
      } catch (err) {
        cachedResponse = caches.match(event.request);
      }
      console.log('caches: ', caches);
      console.log('networkResponsePromise: ', networkResponsePromise);
      console.log('cachedResponse: ', cachedResponse);
      return networkResponsePromise || cachedResponse;
    })()
  );
});
