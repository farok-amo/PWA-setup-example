import * as idb from './idb/build/index.js';

let db;

const DATABASE = 'db_secret_chat';
const POSTS_STORE = 'store_posts';
const TO_UPLOAD_POSTS_STORE = 'store_to_upload_posts';
const CHATS_STORE = 'store_chats';

async function initDatabase(){
    if(!db){
        db = await idb.openDB(DATABASE, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(POSTS_STORE)) {
                    let postsDB = upgradeDb.createObjectStore(POSTS_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    postsDB.createIndex('_id', '_id', {unique: false, multiEntry: true});
                }
                if (!upgradeDb.objectStoreNames.contains(CHATS_STORE)) {
                    let chatsDB = upgradeDb.createObjectStore(CHATS_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    chatsDB.createIndex('chat', 'chat', {unique: false, multiEntry: true});
                }
                if (!upgradeDb.objectStoreNames.contains(TO_UPLOAD_POSTS_STORE)) {
                    let toUpload_postsDB = upgradeDb.createObjectStore(TO_UPLOAD_POSTS_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    toUpload_postsDB.createIndex('id', 'id', {unique: false, multiEntry: true});
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
            for (let elem of readingsList) {
                addPendingPosts(elem);
            }
        }
    }
}
window.getToUploadPostData= getToUploadPostData;


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
window.getAllPostData= getAllPostData;

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

async function deleteOldData(){
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(POSTS_STORE, 'readwrite');
        let store = await tx.objectStore(POSTS_STORE);
        store.clear();

        tx.onsuccess = () => {
            console.log(`Object Store "${POSTS_STORE}" emptied`);
        }

        tx.onerror = (err) => {
            console.error(`Error to empty Object Store: ${POSTS_STORE}`)
        }
    }
}
window.deleteOldData = deleteOldData;

