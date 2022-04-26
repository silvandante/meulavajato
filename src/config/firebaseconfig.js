import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsb5x6Oi3s6JSd9xSnLRqh3J1sSMrO5Yo",
    authDomain: "meulavajato-2ff15.firebaseapp.com",
    projectId: "meulavajato-2ff15",
    storageBucket: "meulavajato-2ff15.appspot.com",
    messagingSenderId: "602895845581",
    appId: "1:602895845581:web:c187ee7cd1711835278184"
}

let app

if (firebase.apps != null && firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app()
}

const database = app.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {database, auth, storage}