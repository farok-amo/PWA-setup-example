let cache= null;
let dataCacheName = 'storyv1';
let cacheName = 'v1';
let filesToCache = [
    '/',
    '/javascripts/index.js',
    '/javascripts/canvas.js',
    '/javascripts/chat-room.js',
    '/stylesheets/style.css',
    '/chat-room/create',

    'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
    '/socket.io/socket.io.js',
    '/stylesheets/widget.min.css',
    '/javascripts/widget.min.js',
];


/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cacheX) {
            console.log('[ServiceWorker] Caching app shell');
            cache= cacheX;
            return cache.addAll(filesToCache);
        })
    );
});


/**
 * activation of service worker: it removes all cashed files if necessary
 */
 self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);
    /*
    * The app is asking for app shell files. In this scenario the app uses the
    * "Cache, falling back to the network" offline strategy:
    * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
    */

      

      if (/\/chat-room\/create?.+/g.exec(e.request.url)){
        // Return join page
        console.log(`[Service Worker] Request Create-Room page`);
        e.respondWith(async function() {
          try {
            response = await fetch(e.request);
            console.log(`[Service Worker] Fetch Create-Room`);
            return response;
          } catch (error) {
            console.log(`[Service Worker] Fetch Offline Create-Room`);
            cashed = await caches.match(e.request)
            return cashed;
          }
        }());
        return;
      }
       if (e.request.url.indexOf('chrome-extension') == 0){
        
        
        console.log('[Service Worker] re-route //chrome-extension', e.request.url);
        e.respondWith(fetch(e.request));

        return;
      }
    
      
      if (e.request.url.indexOf('socket.io/') > -1){
    
        console.log('[Service Worker] re-route socket.io', e.request.url);
        e.respondWith(fetch(e.request));

        return;
      }

      if (e.request.url.indexOf('kgsearch.googleapis.com') == 0){

        console.log('[Service Worker] re-route kgsearch.googleapis.com', e.request.url);
        e.respondWith(fetch(e.request));
        return;
      }
      
      e.respondWith(async function () {
        response = await caches.match(e.request);
    
        // Cache hit - return response
        if (response) {
          return response;
        }
    
        response = await fetch(e.request);
    
        // Response validation
        if (!response || response.status !== 200) {
          console.log(`Response error: [${response.status}]: ${response.statusText}`);
          return response
        }
    
        // Store to the cache
        var responseToCache = response.clone();
        cache = await caches.open(cacheName)
        cache.put(e.request, responseToCache);
    
        return response;
      }());
    })
