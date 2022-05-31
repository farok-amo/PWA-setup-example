function init(){
    sendAjaxQuery('/');
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); });
    }
}

function sendAjaxQuery(url) {
    axios.post(url)
        .then (function (data) {
            addResults(data.data);
            deleteOldData()
                .then(response => console.log("Refreshed Page"))
                .catch(error => console.log("error  deleting: "+ JSON.stringify(error)))
            storePostData(data.data)
                .then(response => console.log('inserting worked!!'))
                .catch(error => console.log("error  inserting: "+ JSON.stringify(error)))
        })
        .catch( function (response) {
            getAllPostData()
                .then(response => console.log('getting posts worked!!'))
                .catch(error => console.log("error retreiving: "+ JSON.stringify(error)))
        })
}

function addResults(posts){
    var postsDiv = document.getElementById('all-posts');
    for(let i in posts){
        let post = posts[i];
        const newDiv = document.createElement("div");
        newDiv.innerHTML = '<div>\n' +
            '            <h1>'+post.title+'</h1>\n' +
            '            <p>Posted on:'+post.createdAt+'</p>\n' +
            '            <p><img src="'+post.img+'"></p>\n' +
            '            <p>By: '+post.author+'</p>\n' +
            '            <p>'+post.description+'</p>\n' +
            '            <a href="./chat-room/create?storyID='+post._id+'"><button>Create room for this post</button></a>'+
            '        </div><br>' ;
        postsDiv.appendChild(newDiv);
    }
}


