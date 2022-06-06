let cache= null;
let dataCacheName = 'storyv1.02';

let filesToCache = [
  'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js',
  
  '/',
  '/story/post-story',
  '/chat-room/create',
  '/chat-room/room',

  '/javascripts/index.js',
  '/javascripts/database.js',
  '/javascripts/story.js',
  '/javascripts/create-room.js',
  '/javascripts/chat-room.js',
  '/javascripts/canvas.js',

  
  '/stylesheets/style.css'


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
      
        // if (/\/chat-room\/create.+/g.exec(e.request.url)){
        //     console.log(`[Service Worker] Request Create-Room page`);
        //     e.respondWith(async function() {
        //       try {
        //         response = await fetch(e.request);
        //         console.log(`[Service Worker] Fetch Create-Room`);
        //         return response;
        //       } catch (error) {
        //         console.log(`[Service Worker] Fetch Offline Create-Room`);
        //         cashed = await caches.match('/chat-room/create')
        //         return cashed;
        //       }
        //     }());
        //     return;
        //   }
  
  
        /*
        * The app is asking for app shell files. In this scenario the app uses the
        * "Cache, falling back to the network" offline strategy:
        * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
        */
        e.respondWith(async function () {
          response = await caches.match(e.request);
      
          if (response) {
            return response;
          }
      
          response = await fetch(e.request);
      
          if (!response || response.status !== 200) {
            console.log(`Response error: [${response.status}]: ${response.statusText}`);
            return response
          }
      
          var responseToCache = response.clone();
          cache = await caches.open(dataCacheName)
          cache.put(e.request, responseToCache);
      
          return response;
        }());
    })
 });
