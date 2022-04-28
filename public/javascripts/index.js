function init(){
    sendAjaxQuery('/');
}

function sendAjaxQuery(url) {
    axios.post(url)
        .then (function (data) {
            var postsDiv = document.getElementById('all-posts');
            postsDiv.innerHTML = data.data ;
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

