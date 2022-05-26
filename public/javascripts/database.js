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
                    postsDB.createIndex('post', 'post', {unique: false, multiEntry: true});
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
                    toUpload_postsDB.createIndex('toUpload_post', 'toUpload_post', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
window.initDatabase = initDatabase;

async function storePostData(postObject) {
    console.log('inserting post');
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(POSTS_STORE, 'readwrite');
            let store = await tx.objectStore(POSTS_STORE);
            await store.put(postObject);
            await  tx.complete;
            console.log('added post to the store! ');
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
}
window.storePostData= storePostData;

async function storeToUploadPostData(postObject) {
    console.log('inserting post');
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

async function getAllPostData() {
    if (!db)
        await initDatabase();
    if (db) {
        console.log('fetching posts');
        let tx = await db.transaction(POSTS_STORE, 'readonly');
        let store = await tx.objectStore(POSTS_STORE);
        let index = await store.index('post');
        let readingsList = await index.getAll();
        await tx.complete;
        if (readingsList && readingsList.length > 0) {
            return readingsList;
        }
    }
}
window.getAllPostData= getAllPostData;
