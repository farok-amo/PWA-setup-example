

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    getOnePost().then(r => console.log(""));
}
var name = null;
var roomNo = null;
var chat = io.connect('/chat');
var rooms = {};
var apiKey = 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';
var postID = null;

/**
 * function to add the posts to the UI
 * @param elem
 */
function addPostToResults(elem){
    postID = elem._id;
    document.getElementById('post-title').innerText= "Create a chat room for post: "+elem.title;
    document.getElementById('post-image').src = elem.img;
    getAllRoomsForEachPost(elem.img).then(r => populatePrevRooms())
}

/**
 * function to get all rooms previously created
 */
function populatePrevRooms(){
    let prevRooms = document.getElementById('prev-rooms');
    for(let room in rooms){
        var option = document.createElement("option");
        option.text = room.valueOf(room);
        prevRooms.add(option);
    }
}

/**
 * setter function
 * @param roomNos
 */
function setRooms(roomNos){
    for(let roomNo in roomNos){
        rooms[roomNo] = roomNo.valueOf(roomNo);
    }
}

/**
 * set the room value to the input field of room no
 */
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

/**
 * function to store the postid and room no in indexeddb
 */
function connectToRoom(){
    let user = document.getElementById('name').value;
    let room_no = document.getElementById('roomNo').value;
    storePostID({id: 1, postID: postID, room: room_no, user: user}).then(r => console.log("redirecting.."));
}




