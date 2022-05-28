function init(){
    sendAjaxQuery('/');
}

function sendAjaxQuery(url) {
    axios.post(url)
        .then (function (data) {
            addResults(data.data);
            deleteOldData();
            for(let i in data.data){
                let post = data.data[i];
                storePostData(post);
            }
        })
        .catch( function (response) {
            addResults(getAllPostData());
            alert (response);
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
            '            <form action="./chat-room/create">\n' +
            '                <input id="storyID" name="storyID"  value="'+post._id+'" style="display: none;">\n' +
            '                <input id="storyImg" name="storyImg"  value="'+post.img+'" style="display: none;">\n' +
            '                <input id="storyTitle" name="storyTitle"  value="'+post.title+'" style="display: none;">\n' +
            '                <input id="storyAuthor" name="storyAuthor"  value="'+post.author+'" style="display: none;">\n' +
            '                <input type="submit" value="Create room for this post">\n' +
            '            </form>\n' +
            '        </div><br>' ;
        postsDiv.appendChild(newDiv);
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

