function init(){
    sendAjaxQuery('/');
}

function sendAjaxQuery(url) {
    axios.post(url)
        .then (function (data) {
            // alert(data.data.toString());
            var posts = document.getElementById('all-posts');
            posts.innerText = JSON.stringify(data.data) ;
        })
        .catch( function (response) {
            alert (response);
        })
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

