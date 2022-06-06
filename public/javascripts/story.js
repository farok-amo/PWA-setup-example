function init(){
    const form = document.getElementById('xForm');
    form.onsubmit = onSubmit;
    getToUploadPostData();
}

/**
 * function to get the pending posts from indexed db and add it to the UI
 * @param posts
 */
function pendingPosts(posts){
    document.getElementById('pending-post-block').style.display = 'block';
    let pendingPostDiv = document.getElementById('pending-posts');
    pendingPostDiv.innerHTML = "";
    for (let elem of posts) {
        const newDiv2 = document.createElement("div");
        newDiv2.innerHTML = '<div>\n'+
            '                   <p>Post: '+elem.postTitle+'</p>'+
            '                   <button onclick="getOneToUploadPostData(\''+elem.id+'\')">Upload Post</button>'+
        '                  </div>'
        pendingPostDiv.appendChild(newDiv2);
    }
}

/**
 * function to send the pending post to the server via axios
 * @param data
 */
function addPendingPosts(data){
    console.log(data);
    sendAxiosQuery('./post-story', data);
    clearUploadedPost(data.id);
}

/**
 * called when the submit button is pressed
 * @param event the submission event
 */
function onSubmit(event) {
    // The .serializeArray() method creates a JavaScript array of objects
    // https://api.jquery.com/serializearray/
    const formArray= $("form").serializeArray();
    const data={};
    for (let index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    sendAxiosQuery('./post-story', data);
    // prevent the form from reloading the page (normal behaviour for forms)
    event.preventDefault()
}

/**
 * function to make server communications
 * @param url
 * @param data
 */
function sendAxiosQuery(url, data) {
    axios.post(url , data)
        .then (function (data) {
            alert(JSON.stringify(data.data))
            window.location.href = '../'
        })
        .catch( function (response) {
            storeToUploadPostData(data).then(r => console.log("Saved data locally"));
            alert ("Cannot connect to server! Story saved locally");
            getToUploadPostData().then(r => console.log("Received the pending posts"));
        })
}