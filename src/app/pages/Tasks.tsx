"use client";
import React, { ReactNode, useState } from "react";
import { getFirestoreDocs, auth, db, addTaskDoc } from "../firebase";

import { collection, addDoc, Timestamp } from "firebase/firestore";
import Header from "../components/Header";
import TasksStatus from "../components/TasksStatus";
import TasksList from "../components/TasksList";
import TaskForm from "../components/TaskForm";
import { Spinner } from "../components/Spinner";
import { Task } from "../types/firebaseTypes";

interface TasksProps {
  children?: ReactNode;
}

const Tasks: React.FC<TasksProps> = ({ children }) => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const userTasks = await getFirestoreDocs();
      if (userTasks) {
        setTasks(userTasks);
      }
    } catch (e) {
      console.error("Failed to fetch tasks", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, [auth.currentUser]);

  const addTask = async (input: string) => {
    try {
      await addTaskDoc(input);
      fetchTasks();
    } catch (e: any) {
      console.error("Error adding task: ", e.message);
    }
  };

  const completed = React.useMemo(
    () => tasks.filter((todo: any) => todo.done == true),
    [tasks]
  );

  return (
    <div className="wrapper">
      {loading && <Spinner />}
      <Header />
      <TasksStatus
        todos_completed={completed.length}
        total_todos={tasks.length}
      />
      <TaskForm todos={tasks} addTask={addTask} />
      <TasksList todos={tasks} fetchTasks={fetchTasks} />
    </div>
  );
};

export default Tasks;
