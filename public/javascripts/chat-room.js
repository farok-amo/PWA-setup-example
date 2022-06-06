
function innit(){
    getOnePost().then(r => console.log(""));
    initChatSocket();
}
var name = null;
var roomNo = null;
var chat = io.connect('/chat');
var apiKey = 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';
var img = null;

/**
 * function to get the post details to add it to the UI
 * @param post
 * @param room
 * @param user
 */
function addPostToResults(post,room,user){
    roomNo = room;
    name = user;
    img = post.img;
    if (!name) name = 'Unknown-' + Math.random();
    chat.emit('create or join', roomNo, name);
    initCanvas(chat, img,user);
    document.getElementById('room-title').innerText = "Chat Room for Story: "+post.title+" by "+post.author;
    document.getElementById('who_you_are').innerHTML= name;
    document.getElementById('in_room').innerHTML= ' '+room;
    document.getElementById('postDescription').innerText = "Description of the Story: "+post.description;
    getKnowledgeGraphHistory(roomNo);
}


/**
 * funciton to start the socket.io
 */
const initChatSocket = () => {

    //when a different user joins the room
    chat.on('joined', (room, userId) => {
        if(userId === name){
            getChatHistory(room);
        } else {
            writeOnHistory('<b>' + userId + '</b>' + 'joined room' + room);
        }
    });

    //when the user chats
    chat.on('chat', (room, userId, chatText) => {
        let sender = userId;
        if(userId === name) sender = 'Me';
        writeOnHistory('<b>' + sender + ':</b> ' + chatText);
        let imageSrc = img;
        storeChatHistory([{room: room, img: imageSrc, sender: sender, message: chatText}]).then (r =>console.log(""));
    });
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    chat.emit('chat', roomNo, name, chatText);
}

/**
 * it appends the given html text to the history div
 * this is to be called when the socket receives the chat message (socket.on ('message'...)
 * @param text: the text to append
 */
function writeOnHistory(text) {
    if (text==='') return;
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    // scroll to the last element
    history.scrollTop = history.scrollHeight;
    document.getElementById('chat_input').value = '';
}


