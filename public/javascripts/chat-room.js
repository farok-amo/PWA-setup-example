
let name = null;
let roomNo = null;
let chat = io.connect('/chat');
let rooms = {};
const apiKey= 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';


/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function initChatRoom() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';
    getOnePost();

    //@todo here is where you should initialise the socket operations as described in teh lectures (room joining, chat message receipt etc.)
    initChatSocket();
}

function addPostToResults(elem){
    document.getElementById('post-title').innerText= "Create a chat room for post: "+elem.title;
    document.getElementById('post-image').src = elem.img;
    document.getElementById('room-title').innerText = "Chat Room for Story:"+elem.title+" by "+elem.author;
    getAllRoomsForEachPost(elem.img).then(r => populatePrevRooms())
}

function populatePrevRooms(){
    let prevRooms = document.getElementById('prev-rooms');
    for(let room in rooms){
        var option = document.createElement("option");
        option.text = room.valueOf(room);
        prevRooms.add(option);
    }
}

function setRooms(roomNos){
    for(let roomNo in roomNos){
        rooms[roomNo] = roomNo.valueOf(roomNo);
    }
}

function setRoomToInput() {
    var selectBox = document.getElementById('prev-rooms');
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    document.getElementById('roomNo').value = selectedValue;
}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    let flag = true, found = false;
    while(flag){
        roomNo = Math.round(Math.random() * 10000);
        for(let room in rooms){
            if(roomNo == room.valueOf(room)){
                found = true;
            }
        }
        if(!found){
            document.getElementById('roomNo').value = 'R' + roomNo;
            document.getElementById('room-code').innerText = 'Your Room Code is: R' + roomNo;
            flag = false;
        }
    }
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
        let imageSrc = document.getElementById('post-image').src;
        storeChatHistory([{room: room,img: imageSrc,sender:sender,message:chatText}]);
    });

    chat.on('drawing', function (roomNo, userId, canvasWidth, canvasHeight){
        if(userId == name){
            let ctx = canvas[0].getContext('2d');
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        }
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

// const service_url = 'https://kgsearch.googleapis.com/v1/entities:search';

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

