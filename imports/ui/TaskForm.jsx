import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { List, ListItem, IconButton, TextField, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";


export const TaskForm = ({ tasks, onCheckboxClick, onDeleteClick }) => {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text) return;

    await Meteor.callAsync("tasks.insert", {
      text: text.trim(),
      createdAt: new Date(),
      userId: Meteor.userId(),
    });

    setText("");
  };

  const getUserName = (userId) => {
    const user = Meteor.users.findOne(userId);
    return user ? user.username : "Unknown User";
  };

  return (
    <div>
      <form className="task-form" onSubmit={handleSubmit}>
        <TextField
          label="Type to add new tasks"
          variant="outlined"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginBottom: "16px" }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Task
        </Button>
      </form>

      <List style={{ marginTop: "16px" }}>
        {tasks.map((task) => (
          <ListItem key={task._id}>
            <div className="task-actions">
              {/* Botão de Concluído */}
              <IconButton
                className="checkbox-btn"
                // onClick={() => {
                //   if (task.status !== "Concluída") {
                //     onCheckboxClick(task);
                //   }
                // }}
                aria-label="toggle"
                //disabled={task.status} 
              >
                <CheckCircleIcon
                  sx={{
                    color:
                      task.status === "Concluída"
                        ? "green"
                        : task.status === "Em Andamento"
                          ? "blue"
                          : "gray",
                  }}
                />
              </IconButton>


              {/* Texto da Tarefa */}
              <div className="task-text">
                {task.text}
                <div className="task-creator">
                  Created by: {getUserName(task.userId)}
                </div>
              </div>

              {/* Botão de Editar */}
              <IconButton
                className="edit-btn"
                onClick={() => navigate(`/tasks/edit/${task._id}`)}
                aria-label="edit"
              >
                <EditIcon color="primary" />
              </IconButton>

              {/* Botão de Deletar */}
              <IconButton
                className="delete-btn"
                onClick={() => onDeleteClick(task)}
                aria-label="delete"
              >
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};