let cache= null;
let dataCacheName = 'storyv1.02';
//list of files/urls that need to be cached for the SW
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

/* 
Event listener for the Install event, it first deletes the old cache of the website if it exists, then opens a new cache
and adds the list specified above in the cache
*/

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

  
/* 
Event Listener for the Fetch event, in the fetch event, we first check chrome-extension, socket.io, and kgsearch.googleapis.com
requests and bypass them, as these request are no ne
*/

self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);


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
      // when SW receives a fetch request
    self.addEventListener('fetch', function(e) {
    
        console.log('[Service Worker] Fetch', e.request.url);
      
        if (e.request.url.indexOf('chrome-extension') == 0){
          // skip extention
          e.respondWith(fetch(e.request));
          return;
        }
      
        if (e.request.url.indexOf('kgsearch.googleapis.com') == 0){
          // skip knowledge graph 
          e.respondWith(fetch(e.request));
          return;
        }
        
        if (e.request.url.indexOf('socket.io/?') > -1){
          // skip socket.io
          e.respondWith(fetch(e.request));
          return;
        }
    
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
