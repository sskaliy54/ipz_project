
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, child, get, update, remove } = require ('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyCXoo5dAifNXKPoCdKupEZwJmrERy7w0m0",
  authDomain: "ipz20-a0618.firebaseapp.com",
  databaseURL: "https://ipz20-a0618-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ipz20-a0618",
  storageBucket: "ipz20-a0618.appspot.com",
  messagingSenderId: "56166710386",
  appId: "1:56166710386:web:b626b6d70b0fce1d4d56eb"
};

const app = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase(app));

async function getData(path) {
  return await get(child(dbRef, path)).then(data => data.exists() ? data.val() : '');
}
  
async function setData(updates) {
  return await update(dbRef, updates).then(() => true);
}

async function removeData(path) {
  const databaseRef = ref(getDatabase(app), path);
  return await remove(databaseRef).then(() => true);
}

module.exports = { getData, setData, removeData };