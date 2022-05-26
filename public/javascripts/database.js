import * as idb from './idb/index.js';

let db;

const DATABASE = 'db_secret_chat';
const POSTS_STORE = 'store_posts';
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
            }
        });
        console.log('db created');
    }
}
window.initDatabase = initDatabase;

async function storePostData(postObject) {
    console.log('inserting: '+JSON.stringify(postObject));
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(POSTS_STORE, 'readwrite');
            let store = await tx.objectStore(POSTS_STORE);
            await store.put(postObject);
            await  tx.complete;
            console.log('added post to the store! '+ JSON.stringify(postObject));
        } catch(error) {
            console.log('error: I could not store the element. Reason: '+error);
        }
    }
    else localStorage.setItem(postObject.title, JSON.stringify(postObject));
}
window.storePostData= storePostData;
