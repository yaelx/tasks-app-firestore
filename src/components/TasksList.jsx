import React from "react";
import { db } from "../app/firebase.js";
import {
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { TextField } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

function TasksList({ todos, getFirestoreDocs }) {
  return (
    <List dense className="todo_list">
      {todos && todos.length > 0 ? (
        todos?.map((item, index) => (
          <Item key={index} item={item} getFirestoreDocs={getFirestoreDocs} />
        ))
      ) : (
        <p>No tasks yet</p>
      )}
    </List>
  );
}

function Item({ item, getFirestoreDocs }) {
  const [editing, setEditing] = React.useState(false);
  const inputRef = React.useRef();

  const completeTodo = async () => {
    const docRef = doc(db, "todos", item.id);
    await updateDoc(docRef, { done: !!item.done ? !item.done : true }).then(
      () => {
        getFirestoreDocs();
      }
    );

    // Update localStorage after marking todo as completed
    // const updatedTodos = JSON.stringify(todos);
    // localStorage.setItem("todos", updatedTodos);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();

      // position the cursor at the end of the text
      if (inputRef.current.value) {
        inputRef.current.setSelectionRange(
          inputRef.current.value.length,
          inputRef.current.value.length
        );
      }
    }
  }, [editing]);

  const handleInputChange = async (e) => {
    // setTodos((prevTodos) =>
    //   prevTodos.map((todo) =>
    //     todo.id === item.id ? { ...todo, title: e.target.value } : todo
    //   )
    // );
    // const docRef = doc(db, "todos", item.id);
    // await updateDoc(docRef, { todo: e.target.value  });
    // getFirestoreDocs();
  };

  const updateTask = async (e) => {
    const docRef = doc(db, "todos", item.id);
    updateDoc(docRef, {
      todo: inputRef.current ? inputRef.current.value : "",
    }).then(() => {
      getFirestoreDocs();
      setEditing(false);
    });
  };

  const handleInpuSubmit = (event) => {
    event.preventDefault();
    // // Update localStorage after editing todo
    // const updatedTodos = JSON.stringify(todos);
    // localStorage.setItem("todos", updatedTodos);
    updateTask();
  };

  const handleInputBlur = () => {
    // Update localStorage after editing todo
    // const updatedTodos = JSON.stringify(todos);
    // localStorage.setItem("todos", updatedTodos);
    setEditing(false);
  };

  const handleDelete = async () => {
    deleteDoc(doc(db, "todos", item.id)).then(() => {
      getFirestoreDocs();
    });

    // setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== item.id));
    // // Update localStorage after deleting todo
    // const updatedTodos = JSON.stringify(
    //   todos.filter((todo) => todo.id !== item.id)
    // );
    // localStorage.setItem("todos", updatedTodos);
  };

  return (
    <>
      {editing ? (
        <ListItem
          key={item.id}
          secondaryAction={
            <IconButton edge="end" aria-label="save" onClick={updateTask}>
              <SaveIcon color="white" fontSize="medium" />
            </IconButton>
          }
          disablePadding
          sx={{ bgcolor: "white" }}
        >
          <ListItemButton role={undefined} onClick={completeTodo} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.done}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <form className="edit-form" onSubmit={handleInpuSubmit}>
                  <TextField
                    inputRef={inputRef}
                    variant="standard"
                    fullWidth
                    id="fullWidth"
                    defaultValue={item?.todo}
                    onBlur={handleInputBlur}
                  />
                </form>
              }
              sx={{ color: "black", fontSize: "16px" }}
            />
          </ListItemButton>
        </ListItem>
      ) : (
        <ListItem
          key={item.id}
          secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={handleEdit}>
                <EditIcon color="white" fontSize="medium" />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
                <DeleteIcon color="white" fontSize="medium" />
              </IconButton>
            </>
          }
          disablePadding
          sx={{ bgcolor: "white" }}
        >
          <ListItemButton role={undefined} onClick={completeTodo} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.done}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText
              primary={item.todo}
              sx={{ color: "black", fontSize: "16px" }}
            />
          </ListItemButton>
        </ListItem>
      )}
    </>
  );
}

export default TasksList;
