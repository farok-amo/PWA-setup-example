
let name = null;
let roomNo = null;
let chat = io.connect('/chat');
let rooms = {};
var apiKey = 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';
let postID = null;


/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    getOnePost().then(r => console.log(""));
}

function addPostToResults(elem){
    postID = elem._id;
    document.getElementById('post-title').innerText= "Create a chat room for post: "+elem.title;
    document.getElementById('post-image').src = elem.img;
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
    roomNo = selectedValue;
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
            document.getElementById('roomNo').value = roomNo;
            // document.getElementById('room-code').innerText = 'Your Room Code is: ' + roomNo;
            flag = false;
        }
    }
}

function connectToRoom(){
    let user = document.getElementById('name').value;
    let room_no = document.getElementById('roomNo').value;
    storePostID({id: 1, postID: postID, room: room_no, user: user}).then(r => console.log("redirecting.."));
}




// const service_url = 'https://kgsearch.googleapis.com/v1/entities:search';




