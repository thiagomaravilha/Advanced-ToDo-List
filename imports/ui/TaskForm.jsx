import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import {
  List,
  ListItem,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

export const TaskForm = ({ tasks, onCheckboxClick, onDeleteClick }) => {
  const [text, setText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    await Meteor.callAsync("tasks.insert", {
      text: text.trim(),
      createdAt: new Date(),
      userId: Meteor.userId(),
      isPrivate,
    });

    setText("");
    setIsPrivate(false);
  };

  const getUserName = (userId) => {
    const user = Meteor.users.findOne(userId);
    return user ? user.username : "Usuário Desconhecido";
  };

  return (
    <div>
      <form className="task-form" onSubmit={handleSubmit}>
        <TextField
          label="Nova tarefa"
          variant="outlined"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginBottom: "12px" }}
        />

        <div style={{ marginBottom: "12px" }}>
          <label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            {" "}Tarefa pessoal (visível só para você)
          </label>
        </div>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Adicionar Tarefa
        </Button>
      </form>

      <List style={{ marginTop: "16px" }}>
        {tasks.map((task) => (
          <ListItem key={task._id}>
            <div className="task-actions" style={{ display: "flex", alignItems: "center", width: "100%" }}>
              {/* Botão de Concluir */}
              <IconButton
                className="checkbox-btn"
                onClick={() => {
                  if (task.status !== "Concluída") {
                    onCheckboxClick(task);
                  }
                }}
                aria-label="toggle"
                disabled={task.status === "Concluída"}
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

              {/* Texto da tarefa */}
              <div className="task-text" style={{ flexGrow: 1 }}>
                {task.text}
                <div className="task-creator" style={{ fontSize: "0.8rem", color: "#555" }}>
                  Criada por: {getUserName(task.userId)}
                  {task.isPrivate && (
                    <LockIcon fontSize="small" style={{ marginLeft: 6, verticalAlign: "middle" }} titleAccess="Tarefa pessoal" />
                  )}
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
