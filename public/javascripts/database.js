import * as idb from './idb/build/index.js';
let db;

const DATABASE = 'db_secret_chat';
const POSTS_STORE = 'store_posts';
const TO_UPLOAD_POSTS_STORE = 'store_to_upload_posts';
const CHATS_STORE = 'store_chats';
const IMAGE_ANNOTATIONS_STORE = 'store_annotations';
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
                    let toUpload_postsDB = upgradeDb.createObjectStore(IMAGE_ANNOTATIONS_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    toUpload_postsDB.createIndex('annotation', 'id', {unique: false, multiEntry: true});
                }
            }
        });
    }
}
window.initDatabase = initDatabase;

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

async function getOnePost(postID) {
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(POSTS_STORE, 'readonly');
        let store = await tx.objectStore(POSTS_STORE);
        let index = await store.index('_id');
        let readingsList = await index.getAll(IDBKeyRange.only(postID));
        await tx.complete;
        if (readingsList && readingsList.length > 0) {
            for (let elem of readingsList) {
                addPostToResults(elem);
            }
        }
    }
}

window.getOnePost= getOnePost;

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