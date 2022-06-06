let name = null;
let roomNo = null;
let chat = io.connect('/chat');
var apiKey = 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';
let img = null;
function innit(){
    getOnePost().then(r => console.log(""));
    initChatSocket();
}
function addPostToResults(post,room,user){
    roomNo = room;
    name = user;
    img = post.img;
    if (!name) name = 'Unknown-' + Math.random();
    chat.emit('create or join', roomNo, name);
    initCanvas(chat, img,user);
    document.getElementById('room-title').innerText = "Chat Room for Story:"+post.title+" by "+post.author;
    document.getElementById('who_you_are').innerHTML= name;
    document.getElementById('in_room').innerHTML= ' '+room;
    getKnowledgeGraphHistory(roomNo);
}


const

    initChatSocket = () => {
    chat.on('joined', (room, userId) => {
        if(userId === name){
            getChatHistory(room);
        } else {
            writeOnHistory('<b>' + userId + '</b>' + 'joined room' + room);
        }
    });

    chat.on('chat', (room, userId, chatText) => {
        let sender = userId;
        if(userId === name) sender = 'Me';
        writeOnHistory('<b>' + sender + ':</b> ' + chatText);
        let imageSrc = img;
        storeChatHistory([{room: room, img: imageSrc, sender: sender, message: chatText}]).then (r =>console.log(""));
    });

    // chat.on('drawing', function (roomNo, userId, canvasWidth, canvasHeight){
    //     if(userId == name){
    //         let ctx = canvas[0].getContext('2d');
    //         ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    //     }
    // })
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




/**
 * it inits the widget by selecting the type from the field myType
 * and it displays the Google Graph widget
 * it also hides the form to get the type
 */
function widgetInit(){
    let type= document.getElementById("myType").value;

    if (type) {
        let config = {
            'limit': 10,
            'languages': ['en'],
            'types': [type],
            'maxDescChars': 100,
            'selectHandler': selectItem,
        }
        KGSearchWidget(apiKey, document.getElementById("myInput"), config);
        document.getElementById('typeSet').innerHTML= 'of type: '+type;
        document.getElementById('widget').style.display='block';
        document.getElementById('typeForm').style.display= 'none';
    }
    else {
        alert('Set the type please');
        document.getElementById('widget').style.display='none';
        document.getElementById('resultPanel').style.display='none';
        document.getElementById('typeSet').innerHTML= '';
        document.getElementById('typeForm').style.display= 'block';
    }
}

/**
 * callback called when an element in the widget is selected
 * @param event the Google Graph widget event {@link https://developers.google.com/knowledge-graph/how-tos/search-widget}
 */
function selectItem(event){
    let row= event.row;
    // document.getElementById('resultImage').src= row.json.image.url;
    document.getElementById('resultId').innerText= 'id: '+row.id;
    document.getElementById('resultName').innerText= row.name;
    document.getElementById('resultDescription').innerText= row.rc;
    document.getElementById("resultUrl").href= row.qc;
    document.getElementById('resultPanel').style.display= 'block';
}