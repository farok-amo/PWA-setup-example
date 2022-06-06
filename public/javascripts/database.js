import * as idb from './idb/build/index.js';
let db;

const DATABASE = 'db_secret_chat';
const POSTS_STORE = 'store_posts';
const TO_UPLOAD_POSTS_STORE = 'store_to_upload_posts';
const CHATS_STORE = 'store_chats';
const IMAGE_ANNOTATIONS_STORE = 'store_annotations';
const POSTID_FOR_CHAT_STORE = 'store_post_id';
const KNOWLEDGE_GRAPH_STORE = 'store_knowledge_graph';

/**
 * function to create the stores in indexeddb
 * @returns {Promise<void>}
 */
async function initDatabase(){
    if(!db){
        db = await idb.openDB(DATABASE, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(POSTS_STORE)) {
                    let postsDB = upgradeDb.createObjectStore(POSTS_STORE, {
                        keyPath: '_id',
                        autoIncrement: true
                    });
                    postsDB.createIndex('_id', '_id', {unique: false, multiEntry: true});
                }
                if (!upgradeDb.objectStoreNames.contains(CHATS_STORE)) {
                    let chatsDB = upgradeDb.createObjectStore(CHATS_STORE, {
                        keyPath: 'message_id',
                        autoIncrement: true
                    });
                    chatsDB.createIndex('chat', 'message_id', {unique: false, multiEntry: true});
                }
                if (!upgradeDb.objectStoreNames.contains(TO_UPLOAD_POSTS_STORE)) {
                    let toUpload_postsDB = upgradeDb.createObjectStore(TO_UPLOAD_POSTS_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    toUpload_postsDB.createIndex('id', 'id', {unique: false, multiEntry: true});
                }
                if (!upgradeDb.objectStoreNames.contains(IMAGE_ANNOTATIONS_STORE)) {
                    let image_annotation_DB = upgradeDb.createObjectStore(IMAGE_ANNOTATIONS_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    image_annotation_DB.createIndex('annotation', 'id', {unique: false, multiEntry: true});
                }
                if (!upgradeDb.objectStoreNames.contains(POSTID_FOR_CHAT_STORE)) {
                    let post_id_DB = upgradeDb.createObjectStore(POSTID_FOR_CHAT_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    post_id_DB.createIndex('post_id', 'id', {unique: false, multiEntry: true});
                }
                if (!upgradeDb.objectStoreNames.contains(KNOWLEDGE_GRAPH_STORE)) {
                    let post_id_DB = upgradeDb.createObjectStore(KNOWLEDGE_GRAPH_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    post_id_DB.createIndex('knowledge_graph', 'id', {unique: false, multiEntry: true});
                }
            }
        });
    }
}
window.initDatabase = initDatabase;


/**
 * function to store all the posts received from mongodb
 * @param postObject
 * @returns {Promise<void>}
 */
async function storePostData(postObject) {
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(POSTS_STORE, 'readwrite');
            let store = await tx.objectStore(POSTS_STORE);
            for(let i in postObject) {
                let post = postObject[i];
                await store.put(post);
            }
            await  tx.complete;
            console.log('added post to the store! ');
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
}
window.storePostData= storePostData;


/**
 * function to the post that is uploaded when offline
 * @param postObject
 * @returns {Promise<void>}
 */
async function storeToUploadPostData(postObject) {
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(TO_UPLOAD_POSTS_STORE, 'readwrite');
            let store = await tx.objectStore(TO_UPLOAD_POSTS_STORE);
            await store.put(postObject);
            await  tx.complete;
            console.log('added post to the store! ');
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
}
window.storeToUploadPostData= storeToUploadPostData;

/**
 * function to get the post that is uploaded when offline(pending posts)
 * @returns {Promise<void>}
 */
async function getToUploadPostData() {
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(TO_UPLOAD_POSTS_STORE, 'readonly');
        let store = await tx.objectStore(TO_UPLOAD_POSTS_STORE);
        let index = await store.index('id');
        let readingsList = await index.getAll();
        await tx.complete;
        if (readingsList && readingsList.length > 0) {
            pendingPosts(readingsList);
        }
    }
}
window.getToUploadPostData= getToUploadPostData;


/**
 * function to get the post that the user wishes to upload when back online
 * @param postID
 * @returns {Promise<void>}
 */
async function getOneToUploadPostData(postID) {
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(TO_UPLOAD_POSTS_STORE, 'readonly');
        let store = await tx.objectStore(TO_UPLOAD_POSTS_STORE);
        let index = await store.index('id');
        let readingsList = await index.getAll(IDBKeyRange.only(parseInt(postID)));
        await tx.complete;
        if (readingsList && readingsList.length > 0) {
            for (let elem of readingsList) {
                console.log(elem);
                addPendingPosts(elem);
            }
        }
    }
}
window.getOneToUploadPostData= getOneToUploadPostData;


/**
 * function to delete all the uploaded posts from pending posts
 * @param postID
 * @returns {Promise<void>}
 */
async function clearUploadedPost(postID){
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(TO_UPLOAD_POSTS_STORE, 'readwrite');
        let store = await tx.objectStore(TO_UPLOAD_POSTS_STORE);
        store.delete(postID);

        tx.onsuccess = () => {
            console.log(`Object Store "${TO_UPLOAD_POSTS_STORE}" emptied`);
        }

        tx.onerror = (err) => {
            console.error(`Error to empty Object Store: ${TO_UPLOAD_POSTS_STORE}`)
        }
    }
}
window.clearUploadedPost = clearUploadedPost;


/**
 * fucntion to get all the posts from indexeddb and display on the UI
 * @returns {Promise<void>}
 */
async function getAllPostData() {
    if (!db)
        await initDatabase();
    if (db) {
        console.log('fetching posts');
        let tx = await db.transaction(POSTS_STORE, 'readonly');
        let store = await tx.objectStore(POSTS_STORE);
        let index = await store.index('_id');
        let readingsList = await index.getAll();
        await tx.complete;
        if (readingsList && readingsList.length > 0) {
            addResults(readingsList);
        }
    }
}
window.getAllPostData = getAllPostData;


/**
 * function to get the single post that is used to chat
 * @returns {Promise<void>}
 */
async function getOnePost() {
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(POSTID_FOR_CHAT_STORE, 'readonly');
        let post_id_store = await tx.objectStore(POSTID_FOR_CHAT_STORE);
        let post_id_index = await post_id_store.index('post_id');
        let readingsList1 = await post_id_index.getAll(IDBKeyRange.only(1));
        await tx.complete;
        let postID;
        let roomNo = "";
        let user = "";
        if (readingsList1 && readingsList1.length > 0) {
            for (let elem of readingsList1) {
                postID = elem.postID;
                if(elem.room){
                    roomNo = elem.room;
                    user = elem.user;
                }
            }
        }
        let tx_1 = await db.transaction(POSTS_STORE, 'readonly');
        let posts_store = await tx_1.objectStore(POSTS_STORE);
        let posts_index = await posts_store.index('_id');
        let readingsList = await posts_index.getAll(IDBKeyRange.only(postID));
        await tx_1.complete;
        if (readingsList && readingsList.length > 0) {
            for (let elem of readingsList) {
                if(roomNo==""){
                    addPostToResults(elem);
                }else{
                    addPostToResults(elem,roomNo,user);
                }

            }
        }
    }
}
window.getOnePost= getOnePost;

/**
 * function to store chat history
 * @param chats
 * @returns {Promise<void>}
 */
async function storeChatHistory(chats) {
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(CHATS_STORE, 'readwrite');
            let store = await tx.objectStore(CHATS_STORE);
            for(let i in chats) {
                let chat = chats[i];
                await store.put(chat);
            }
            await  tx.complete;
            console.log('added post to the store! ');
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
}
window.storeChatHistory= storeChatHistory;

/**
 * function to get chat history
 * @param roomNo
 * @returns {Promise<void>}
 */
async function getChatHistory(roomNo) {
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(CHATS_STORE, 'readonly');
        let store = await tx.objectStore(CHATS_STORE);
        let index = await store.index('chat');
        let readingsList = await index.getAll();
        await tx.complete;
        if (readingsList && readingsList.length > 0) {
            for (let elem of readingsList) {
                if(elem.room == roomNo){
                    writeOnHistory('<b>' + elem.sender + ':</b> ' + elem.message);
                }
            }
        }
    }
}
window.getChatHistory= getChatHistory;

/**
 * function to store the annotations
 * @param annotation
 * @returns {Promise<void>}
 */
async function storeAnnotations(annotation) {
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(IMAGE_ANNOTATIONS_STORE, 'readwrite');
            let store = await tx.objectStore(IMAGE_ANNOTATIONS_STORE);
            for(let i in annotation) {
                let index = annotation[i];
                await store.put(index);
            }
            await  tx.complete;
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
}
window.storeAnnotations= storeAnnotations;


/**
 * function to get all annotations
 * @param roomNo
 * @param img
 * @returns {Promise<void>}
 */
async function getAnnotationsHistory(roomNo,img) {
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(IMAGE_ANNOTATIONS_STORE, 'readonly');
        let store = await tx.objectStore(IMAGE_ANNOTATIONS_STORE);
        let index = await store.index('annotation');
        let readingsList = await index.getAll();
        await tx.complete;
        let cvx = document.getElementById('canvas');
        let ctx = cvx.getContext('2d');
        if (readingsList && readingsList.length > 0) {
            for (let elem of readingsList) {
                if(elem.roomNo == roomNo && elem.img == img){
                    drawOnCanvas(ctx, elem.canvas_width, elem.canvas_height, elem.prevX, elem.prevY, elem.currX, elem.currY, elem.color, elem.thickness);
                    // console.log(ctx, elem.canvas_width, elem.canvas_height, elem.prevX, elem.prevY, elem.currX, elem.currY, elem.color, elem.thickness);
                }
            }
        }
    }
}
window.getAnnotationsHistory= getAnnotationsHistory;


/**
 * functiion to get all the created rooms
 * @param imgUrl
 * @returns {Promise<void>}
 */
async function getAllRoomsForEachPost(imgUrl) {
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(CHATS_STORE, 'readonly');
        let store = await tx.objectStore(CHATS_STORE);
        let index = await store.index('chat');
        let readingsList = await index.getAll();
        await tx.complete;
        var roomNos = {}
        if (readingsList && readingsList.length > 0) {
            for (let elem of readingsList) {
                if(elem.img == imgUrl){
                    roomNos[elem.room] = elem.room;
                }
            }
            setRooms(roomNos);
        }
    }
}
window.getAllRoomsForEachPost= getAllRoomsForEachPost;


/**
 * funtion to store the post id(needed to send data from one page to the other)
 * @param postID
 * @returns {Promise<void>}
 */
async function storePostID(postID) {
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(POSTID_FOR_CHAT_STORE, 'readwrite');
            let store = await tx.objectStore(POSTID_FOR_CHAT_STORE);
            await store.put(postID);
            await  tx.complete;
            console.log('added post to the store! ');
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
}
window.storePostID= storePostID;

/**
 * function to clear the annotations
 * @param roomNo
 * @returns {Promise<void>}
 */
async function clearAnnotations(roomNo){
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(IMAGE_ANNOTATIONS_STORE, 'readwrite');
        let store = await tx.objectStore(IMAGE_ANNOTATIONS_STORE);
        let index = await store.index('annotation');
        let readingsList = await index.getAll();
        if (readingsList && readingsList.length > 0) {
            for (let elem of readingsList) {
                if(elem.roomNo == roomNo){
                    store.delete(elem.id);
                }
            }
        }
    }
}
window.clearAnnotations = clearAnnotations;

/**
 * function to store knowdgegraphs
 * @param data
 * @returns {Promise<void>}
 */
async function storeKnowledgeGraph(data) {
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(KNOWLEDGE_GRAPH_STORE, 'readwrite');
            let store = await tx.objectStore(KNOWLEDGE_GRAPH_STORE);
            await store.put(data);
            await  tx.complete;
            console.log('added knowledge graph! ');
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
}
window.storeKnowledgeGraph= storeKnowledgeGraph;


/**
 * function to get knowledgegraph history
 * @param roomNo
 * @returns {Promise<void>}
 */
async function getKnowledgeGraphHistory(roomNo){
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(KNOWLEDGE_GRAPH_STORE, 'readonly');
        let store = await tx.objectStore(KNOWLEDGE_GRAPH_STORE);
        let index = await store.index('knowledge_graph');
        let readingsList = await index.getAll();
        await tx.complete;
        if (readingsList && readingsList.length > 0) {
            for (let elem of readingsList) {
                if(elem.room == roomNo){
                    addKnowledgeGraph(elem);
                }
            }
        }
    }
}
window.getKnowledgeGraphHistory= getKnowledgeGraphHistory;