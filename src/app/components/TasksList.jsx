import React from "react";

import { doc, deleteDoc } from "firebase/firestore";
import {
  List,
  FormControl,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { deleteTaskDoc, updateTaskDoc } from "../firebase";

function TasksList({ todos, fetchTasks }) {
  return (
    <List dense className="todo_list">
      {todos && todos.length > 0 ? (
        todos?.map((item, _) => (
          <Item key={item.id} item={item} fetchTasks={fetchTasks} />
        ))
      ) : (
        <p>No tasks yet</p>
      )}
    </List>
  );
}

function Item({ item, fetchTasks }) {
  const [editing, setEditing] = React.useState(false);
  const inputRef = React.useRef();
  const [formFields, setFormFields] = React.useState(item);
  const { todo, done, id } = formFields;

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

  const updateTask = async (updates) => {
    try {
      await updateTaskDoc(id, updates);
    } catch (e) {
      console.error("Error updating task: ", e);
    } finally {
      fetchTasks();
      setEditing(false);
    }
  };

  const handleInpuSubmit = (event) => {
    event.preventDefault();
    updateTask(formFields);
  };

  // const handleInputBlur = () => {
  //   // Update localStorage after editing todo
  //   // const updatedTodos = JSON.stringify(todos);
  //   // localStorage.setItem("todos", updatedTodos);
  //   setEditing(false);
  // };

  const handleDelete = async () => {
    try {
      await deleteTaskDoc(id);
    } catch (e) {
      console.error("Error deleting task: ", e);
    } finally {
      fetchTasks();
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setFormFields((prev) => ({ ...prev, todo: value }));
  };

  const handleChangeDone = async (event) => {
    event.preventDefault();
    const { checked } = event.target;
    setFormFields((prev) => {
      const newTask = {
        ...prev,
        done: checked,
      };
      updateTask(newTask);
      return newTask;
    });
  };

  const handleSave = async () => {
    updateTask(formFields);
  };

  return (
    <>
      {editing ? (
        <ListItem
          key={item.id}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="save"
              onClick={() => handleSave()}
            >
              <SaveIcon fontSize="medium" />
            </IconButton>
          }
          disablePadding
          sx={{ bgcolor: "white" }}
        >
          <ListItemButton role={undefined} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={done}
                tabIndex={-1}
                disableRipple
                onChange={handleChangeDone}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                // <form className="edit-form" onSubmit={handleInpuSubmit}>
                //   <TextField
                //     inputRef={inputRef}
                //     variant="standard"
                //     fullWidth
                //     id="fullWidth"
                //     defaultValue={item?.todo}
                //     onBlur={handleInputBlur}
                //   />
                // </form>
                <form className="edit-form" onSubmit={handleInpuSubmit}>
                  <FormControl
                    sx={{ m: 1, width: "30ch" }}
                    variant="outlined"
                    onSubmit={handleInpuSubmit}
                  >
                    <OutlinedInput
                      inputRef={inputRef}
                      id="displayName-input"
                      aria-describedby="displayName-input"
                      value={todo}
                      onChange={handleChange}
                      // onBlur={handleInputBlur}
                      placeholder="Enter a task"
                      required
                    />
                  </FormControl>
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
                <EditIcon fontSize="medium" />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
                <DeleteIcon fontSize="medium" />
              </IconButton>
            </>
          }
          disablePadding
          sx={{ bgcolor: "white" }}
        >
          <ListItemButton role={undefined} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={formFields.done}
                onChange={handleChangeDone}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText
              primary={formFields.todo}
              sx={{ color: "black", fontSize: "16px" }}
            />
          </ListItemButton>
        </ListItem>
      )}
    </>
  );
}

export default TasksList;
