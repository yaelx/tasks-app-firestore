import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8IoklPTKiAUJd11ANuE6S--Z9iJmzsPw",
  authDomain: "todo-667d6.firebaseapp.com",
  projectId: "todo-667d6",
  storageBucket: "todo-667d6.appspot.com",
  messagingSenderId: "306734127876",
  appId: "1:306734127876:web:45e242d502c81fbff98e51",
  measurementId: "G-22GR87H5J7",
};

// var firebaseConfig = {
//   apiKey: "AIzaSyAeKhs_FS97RSxJV0avdiy0HtNKOAsN1xw",
//   authDomain: "notifications-682c2.firebaseapp.com",
//   databaseURL: "https://notifications-682c2.firebaseio.com",
//   projectId: "notifications-682c2",
//   storageBucket: "notifications-682c2.appspot.com",
//   messagingSenderId: "519324039232",
// };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

const email = "yaelisad@gmail.com";
const password = "123456";

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("User signed in:", userCredential.user);
  })
  .catch((error) => {
    console.error("Authentication error:", error.message);
  });

export { storage, auth, db };
