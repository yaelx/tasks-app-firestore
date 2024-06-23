"use client";
import React from "react";
import { storage, auth, db } from "./firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import TaskForm from "../components/TaskForm";
import Header from "../components/Header";
import TasksStatus from "../components/TasksStatus";
import TasksList from "../components/TasksList";

const colRef = collection(db, "todos");
const q = query(colRef, orderBy("timestamp", "desc"));

function Home() {
  const [todos, setTodos] = React.useState([]);

  // // Retrieve data from localStorage when component mounts
  // React.useEffect(() => {
  //   const storedTodos = localStorage.getItem("todos");
  //   if (storedTodos) {
  //     setTodos(JSON.parse(storedTodos));
  //   }
  // }, []);

  const getFirestoreDocs = React.useCallback(async () => {
    const { docs } = await getDocs(q);
    const data = docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setTodos(data as any);
  }, []);

  React.useEffect(() => {
    getFirestoreDocs();
  }, []);

  const addTask = async (input: string) => {
    const docRef = await addDoc(collection(db, "todos"), {
      todo: input,
      done: false,
      timestamp: serverTimestamp(),
    });
    getFirestoreDocs();
  };

  const completed = React.useMemo(
    () => todos.filter((todo: any) => todo.done == true),
    [todos]
  );

  return (
    <div className="wrapper">
      <Header />
      <TasksStatus
        todos_completed={completed.length}
        total_todos={todos.length}
      />
      <TaskForm todos={todos} addTask={addTask} />
      <TasksList todos={todos} getFirestoreDocs={getFirestoreDocs} />
    </div>
  );
}

export default Home;
