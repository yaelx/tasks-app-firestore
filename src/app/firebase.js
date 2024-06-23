import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import "firebase/compat/auth";


const firebaseConfig = {
    apiKey: "AIzaSyB8IoklPTKiAUJd11ANuE6S--Z9iJmzsPw",
    authDomain: "todo-667d6.firebaseapp.com",
    projectId: "todo-667d6",
    storageBucket: "todo-667d6.appspot.com",
    messagingSenderId: "306734127876",
    appId: "1:306734127876:web:45e242d502c81fbff98e51",
    measurementId: "G-22GR87H5J7"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);


export { storage, auth, db };