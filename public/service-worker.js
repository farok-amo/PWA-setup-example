let cache= null;
let dataCacheName = 'storyv1';
let cacheName = 'v1';
let filesToCache = [
    '/',
    '/javascript/index.js',
    '/javascript/canvas.js',
    '/javascript/chat-room.js',
    '/stylesheets/style.css',
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
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    /*
     * Fixes a corner case in which the app wasn't returning the latest data.
     * You can reproduce the corner case by commenting out the line below and
     * then doing the following steps: 1) load app for first time so that the
     * initial New York City data is shown 2) press the refresh button on the
     * app 3) go offline 4) reload the app. You expect to see the newer NYC
     * data, but you actually see the initial data. This happens because the
     * service worker is not yet activated. The code below essentially lets
     * you activate the service worker faster.
     */
    return self.clients.claim();
});


/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 * all the other pages are searched for in the cache. If not found, they are returned
 */
self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);
    /*
    * The app is asking for app shell files. In this scenario the app uses the
    * "Cache, falling back to the network" offline strategy:
    * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
    */
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response
                || fetch(e.request)
                    .then(function (response) {
                        // note if network error happens, fetch does not return
                        // an error. it just returns response not ok
                        // https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
                        if (!response.ok ||  response.statusCode>299) {
                            console.log("error: " + response.error());
                        } else {
                            cache.add(e.request.url);
                            return response;
                        }
                    })
                    .catch(function (err) {
                        console.log("error: " + err);
                    })
        })
    );
    });
