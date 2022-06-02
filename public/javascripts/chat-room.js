
let name = null;
let roomNo = null;
let chat = io.connect('/chat');

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function initChatRoom(postID) {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';
    getOnePost(postID);

    //@todo here is where you should initialise the socket operations as described in teh lectures (room joining, chat message receipt etc.)
    initChatSocket();
}

function addPostToResults(elem){
    document.getElementById('post-title').innerText= "Create a chat room for post: "+elem.title;
    document.getElementById('post-image').src = elem.img;
    document.getElementById('room-title').innerText = "Chat Room for Story:"+elem.title+" by "+elem.author;
}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
    document.getElementById('room-code').innerText = 'Your Room Code is: R' + roomNo;
}

const initChatSocket = () => {
    chat.on('joined', (room, userId) => {
        if(userId === name){
            hideLoginInterface(room, userId);
            getChatHistory(room);
        } else {
            writeOnHistory('<b>' + userId + '</b>' + 'joined room' + room);
        }
    });

    chat.on('chat', (room, userId, chatText) => {
        let sender = userId;
        if(userId === name) sender = 'Me';
        writeOnHistory('<b>' + sender + ':</b> ' + chatText);
        storeChatHistory([{room: room,sender:sender,message:chatText}]);
    })
}
/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    chat.emit('chat', roomNo, name, chatText);
    // @todo send the chat message
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;
    let imageSrc = document.getElementById('post-image').src;
    if (!name) name = 'Unknown-' + Math.random();
    chat.emit('create or join', roomNo, name);
    //@todo join the room
    initCanvas(chat, imageSrc);
    hideLoginInterface(roomNo, name);
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

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

