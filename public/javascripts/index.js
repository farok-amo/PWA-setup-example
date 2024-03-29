function init(){
    sendAjaxQuery('/');
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); });
    }
}
let posts;
function init(){
    sendAxiosQuery('/');
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); });
    }
}

/**
 * function to make axios calls to get the posts from the server
 * @param url
 */
function sendAxiosQuery(url) {
    axios.post(url)
        .then (function (data) {
            posts = JSON.parse(JSON.stringify(data.data));
            addResults(data.data);
            storePostData(data.data)
                .then(response => console.log('Refreshed Page!!'))
                .catch(error => console.log("error  inserting: "+ JSON.stringify(error)))
        })
        .catch( function (response) {
            getAllPostData()
                .then(response => console.log('getting posts worked!!'))
                .catch(error => console.log("error retreiving: "+ JSON.stringify(error)))
        })
}

/**
 * function to add the posts to the UI
 * @param posts
 */
function addResults(posts){
    var postsDiv = document.getElementById('all-posts');
    postsDiv.innerHTML = '';
    for(let i in posts){
        let post = posts[i];
        const newDiv = document.createElement("div");
        newDiv.innerHTML = '<div class="container row mb-3">\n' +
            '            <h1 class="fw-bold font-monospace">'+post.title+'</h1>\n' +
            '            <p class="fw-normal font-monospace fst-normal">Posted on:'+post.createdAt+'</p>\n' +
            '            <p class="img-thumbnail mw-80 "><img src="'+post.img+'"></p>\n' +
            '            <p class="fw-bold font-monospace">By: '+post.author+'</p>\n' +
            '            <p class="fw-normal font-monospace">'+post.description+'</p>\n' +
            '            <a href="./chat-room/create" onclick="getPostID(\''+post._id+ '\')"><button class="btn btn-secondary btn-group-lg">Chat room for this post</button></a>'+
            '        </div><br>' ;
        postsDiv.appendChild(newDiv);
    }
}

/**
 * function to cache the postID
 * @param postID
 */
function getPostID(postID){
    console.log(postID);
    storePostID({id: 1, postID: postID}).then(r => console.log("redirecting.."));
}


/**
 * function to sort the JSON array
 * @param prop
 * @returns {(function(*, *): (number))|*}
 * @constructor
 */
function GetSortOrder(prop) {
    return function(a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

/**
 * function to sort the posts based on author name and date
 * @param value
 */
function sortPosts(value){
    posts.sort(GetSortOrder(value));
    addResults(posts);
}


window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
function updateStatus (event) {
    if (navigator.onLine) {
        console.log("Your connection is back.")
    } else {
        console.log("You have lost your internet connection");
    }
}
