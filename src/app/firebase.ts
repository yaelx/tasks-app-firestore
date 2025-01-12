import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import "firebase/compat/auth";
import { Task } from "./types/firebaseTypes";

const firebaseConfig = {
  apiKey: "AIzaSyB8IoklPTKiAUJd11ANuE6S--Z9iJmzsPw",
  authDomain: "todo-667d6.firebaseapp.com",
  projectId: "todo-667d6",
  storageBucket: "todo-667d6.appspot.com",
  messagingSenderId: "306734127876",
  appId: "1:306734127876:web:45e242d502c81fbff98e51",
  measurementId: "G-22GR87H5J7",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
const tasksColRef = collection(db, "todos");

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase auth persistence set to localStorage.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

const createUserFirestore = async (
  username: string,
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;
    // Add the user document to Firestore
    await setDoc(doc(db, "users", userId), {
      username,
      email,
    });
    // Return the userCredential for further use
    return userCredential;
  } catch (error) {
    console.error("Error creating user or adding document: ", error);
    throw error; // Rethrow the error to handle it in the caller
  }
};

const getFirestoreDocs = async (): Promise<Task[]> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not logged in");
  }

  try {
    const q = query(
      tasksColRef,
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Partial<Task>),
    } as Task));
    return tasks;
  } catch (e: any) {
    console.error("Error fetching tasks: ", e);
    throw Error(e.maessage);
  }
};

const addTaskDoc = async (todo: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not logged in");
  }

  try {
    const docRef = await addDoc(collection(db, "todos"), {
      todo,
      done: false,
      createdAt: serverTimestamp(),
      uid: user.uid,
    });
    console.log("Task created with ID: ", docRef.id);
  } catch (e: any) {
    console.error("Error adding task: ", e);
    throw Error(e.maessage);
  }
};

/**
   * 
   * @param {*} updates: Partial<{
      todo: string;
      description: string;
      done: boolean;
    }>
   */
const updateTaskDoc = async (itemId: string, updates: Partial<Task>) => {
  console.log("updateTask: ", itemId);
      if (!itemId) {
    throw new Error("itemId is not passed");
  }
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not logged in");
  }
  try {
    const taskRef = doc(db, "todos", itemId);
    // Ensure the task belongs to the logged-in user (you can enforce this with security rules)
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    console.log("Task updated successfully");
  } catch (e: any) {
    console.error("Error updating task: ", e);
    throw Error(e.maessage);
  }
};

const deleteTaskDoc = async (itemId: string) => {
  console.log("deleteTaskDoc: ", itemId);
    if (!itemId) {
    throw new Error("itemId is not passed");
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not logged in");
  }
  try {
    const taskRef = doc(db, "todos", itemId);
    // Ensure the task belongs to the logged-in user (enforced via Firestore rules)
    await deleteDoc(taskRef);

    console.log(`Task id: ${itemId} deleted successfully`);
  } catch (e: any) {
    console.error("Error deleting task: ", e);
    throw Error(e.maessage);
  }
};

export {
  storage,
  auth,
  db,
  createUserFirestore,
  getFirestoreDocs,
  addTaskDoc,
  updateTaskDoc,
  deleteTaskDoc,
};
