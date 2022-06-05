let cache= null;
let dataCacheName = 'storyv1.01';
let filesToCache = [
    '/',
    '/javascripts/index.js',
    '/javascripts/canvas.js',
    '/javascripts/chat-room.js',
    '/javascripts/create-room.js',
    '/javascripts/database.js',
    '/javascripts/knowledgeGraph.js',
    '/javascripts/story.js',
    '/stylesheets/style.css',
    '/chat-room/create',
    '/story/post-story',

    'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
    '/socket.io/socket.io.js',
    '/stylesheets/widget.min.css',
    '/javascripts/widget.min.js',
];


self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(async function(){
      console.log('[ServiceWorker] Removing old cache');
      caches.delete(dataCacheName);
  
      console.log('[ServiceWorker] Caching app shell');
      cache = await caches.open(dataCacheName);
      return cache.addAll(filesToCache);
    }());
  });
  


 self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);
    /*
    * The app is asking for app shell files. In this scenario the app uses the
    * "Cache, falling back to the network" offline strategy:
    * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
    */

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
      // when the worker receives a fetch request
    self.addEventListener('fetch', function(e) {
    
        console.log('[Service Worker] Fetch', e.request.url);
      
        if (e.request.url.indexOf('chrome-extension') == 0){
          // Bypass extention
          e.respondWith(fetch(e.request));
          return;
        }
      
        if (e.request.url.indexOf('kgsearch.googleapis.com') == 0){
          // Bypass knowledge graph queries
          e.respondWith(fetch(e.request));
          return;
        }
        
        if (e.request.url.indexOf('socket.io/?') > -1){
          // Bypass socket io
          e.respondWith(fetch(e.request));
          return;
        }
      
  
  
        /*
        * The app is asking for app shell files. In this scenario the app uses the
        * "Cache, falling back to the network" offline strategy:
        * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
        */
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
          cache = await caches.open(dataCacheName)
          cache.put(e.request, responseToCache);
      
          return response;
        }());
    })
 });
